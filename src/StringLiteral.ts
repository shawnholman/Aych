import {Renderable, SimpleObject} from "./interfaces";
import {Aych} from "./Aych";

const TEMPLATE_START_TAG = '{{';
const TEMPLATE_END_TAG = '}}';
const TEMPLATE_FILTER_PIPE = '|';

const TEMPLATE_BUFFERED_START_TAG = TEMPLATE_START_TAG + '\\s*';
const TEMPLATE_BUFFERED_END_TAG = '\\s*' + TEMPLATE_END_TAG;
const TEMPLATE_BUFFERED_FILTER_PIPE = '\\s*\\' + TEMPLATE_FILTER_PIPE + '\\s*';
const IDENTIFIER = '[\\w-_][\\w\\d-_]*';
const FULL_IDENTIFIER = '(([\\w-_][\\w\\d-_]*(\\[-?\\d+\\])?\\??)(\\.[\\w-_][\\w\\d-_]*(\\[-?\\d+\\])?\\??)*)';
const FILTER = '(' + TEMPLATE_BUFFERED_FILTER_PIPE + '(([\\w-_][\\w\\d-_]*)(\\((([\\w\\d]+)(,\\s*[\\w\\d]+)*)?\\))?))?';
const TEMPLATE_TAG = new RegExp(TEMPLATE_BUFFERED_START_TAG + FULL_IDENTIFIER + FILTER + TEMPLATE_BUFFERED_END_TAG, 'g');
const SIMPLE_TEMPLATE_TAG = new RegExp(TEMPLATE_BUFFERED_START_TAG + IDENTIFIER + TEMPLATE_BUFFERED_END_TAG, 'g');


export class StringLiteral implements Renderable {
    private string: string;

    constructor(str: string) {
        this.string = StringLiteral.escapeHtml(str);
    }

    /** @inheritdoc */
    render(templates?: SimpleObject): string {
        if (!templates || !StringLiteral.Templater.probablyHasTemplates(this.string)) {
            return this.string;
        }
        return new StringLiteral.Templater(this.string).inject(templates);
    }

    /**
     * Escape HTML inside of a string
     * @param unsafe the string to escape
     */
    private static escapeHtml(unsafe:string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    private static Templater = class {
        private readonly value: string;
        private readonly simpleMode: boolean = false;

        constructor(str: string, simpleMode = false) {
            this.value = str;
            this.simpleMode = simpleMode || this.isSimple(str);
        }

        /**
         * Resolves templates inside of a string.
         * @param string the string to template
         * @param templates the date to use for the template
         */
        inject(templates: SimpleObject) {
            if (this.simpleMode) {
                let templateEntries = Object.entries(templates);
                let string = this.value;
                for (const [name, value] of templateEntries) {
                    string = string.replace(TEMPLATE_START_TAG + name + TEMPLATE_END_TAG, value.toString());
                }
                return string;
            }

            return this.value.replace(TEMPLATE_TAG, (...groups) => {
                let key = groups[1];
                let value = this.getFromObject(templates, key).toString();
                let pipeFunction = groups[8];
                let parameters = groups[10];
                return this.pipe(value, pipeFunction, parameters);
            });
        }

        private pipe(value: string, pipeName: string, parameters: string) {
            if (pipeName !== undefined) {
                let params = parameters !== undefined ? parameters.split(/\s*,\s*/) : [];

                if (Aych.Pipes.hasOwnProperty(pipeName)) {
                    // @ts-ignore
                    return Aych.Pipes[pipeName].apply(null, [value, ...params]);
                } else {
                    throw new Error(`Pipe ${pipeName} does not exist.`);
                }
            }
            return value;
        }

        /**
         * Determines whether the template string is simple.
         */
        private isSimple(string: string): boolean {
            return string.replace(SIMPLE_TEMPLATE_TAG, '').trim() === '';
        }

        /**
         * A quick check to see if a string has templates. This check does not
         * validate that the potential template is usable.
         * @param string
         */
        static probablyHasTemplates(string: string) {
            return string.includes(TEMPLATE_START_TAG) && string.includes(TEMPLATE_END_TAG);
        }

        /**
         * Get the value of a key from an object.
         * @param object the object to search
         * @param key A string representing the key of the value in the object that you are looking for. These follow
         * standard javascript syntax. For example:
         *     getFromObject({ array: [1, 2, 3, 4] }, 'array[2]') ===> 2
         *     getFromObject({ array: [{}, { key: 'value' }]}, 'array[1].key') ===> 'value'
         */
        private getFromObject(object: SimpleObject, key: string): string | number | boolean {
            let keys = key.trim().split(".");
            let found = false;
            let track: any = object;
            let last: string | undefined;

            while (keys.length > 0) {
                let key = keys[0].trim();
                let isOptional = false;
                if (key.endsWith("?")) {
                    isOptional = true;
                    // remove the optional sign
                    key = key.slice(0, -1);
                }

                let keyIsArray = key.match(/([\w-_][\w\d-_]*)\[([-]?\d+)]/);
                if (keyIsArray) {
                    let name = keyIsArray[1];
                    let index = parseInt(keyIsArray[2]);

                    if (index < 0) {
                        throw new Error(`Index should be greater than 0 >>> ${name}[${index}]`);
                    }
                    if (track.hasOwnProperty(name)) {
                        let child = track[name];

                        if (Array.isArray(child) && index < child.length) {
                            track = child[index];
                            found = true;
                        } else {
                            if (isOptional) {
                                return '';
                            }
                            throw new Error(`Index should be less than ${child.length} >>> ${name}[${index}]`);
                        }
                    } else {
                        if (isOptional) {
                            return '';
                        }
                        throw new Error(name + " is not a property of " + last);
                    }
                } else {
                    if (track.hasOwnProperty(key)) {
                        track = track[key];
                        found = true;
                    } else {
                        if (isOptional) {
                            return '';
                        }
                        throw new Error(key + " is not a property of " + last);
                    }
                }
                last = keys.shift();
            }

            return found ? track : '';
        }
    }
}
