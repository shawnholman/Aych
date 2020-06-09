import {Renderable, SimpleObject} from "../interfaces";
import {Aych} from "./Aych";

const TEMPLATE_START_TAG = '{{';
const TEMPLATE_END_TAG = '}}';
const TEMPLATE_FILTER_PIPE = '|';

const TEMPLATE_BUFFERED_START_TAG = TEMPLATE_START_TAG + '\\s*';
const TEMPLATE_BUFFERED_END_TAG = '\\s*' + TEMPLATE_END_TAG;
const TEMPLATE_BUFFERED_FILTER_PIPE = '\\s*\\' + TEMPLATE_FILTER_PIPE + '\\s*';
const FULL_IDENTIFIER = '(([\\w-_][\\w\\d-_]*(\\[-?\\d+\\])?\\??)(\\.[\\w-_][\\w\\d-_]*(\\[-?\\d+\\])?\\??)*)';
const FILTER = '(' + TEMPLATE_BUFFERED_FILTER_PIPE + '(([\\w-_][\\w\\d-_]*)(\\((([\\w\\d]+)(,\\s*[\\w\\d]+)*)?\\))?))?';
const TEMPLATE_TAG = new RegExp(TEMPLATE_BUFFERED_START_TAG + FULL_IDENTIFIER + FILTER + TEMPLATE_BUFFERED_END_TAG, 'g');

const PIPE_KEY_INDEX = 1;
const PIPE_FUNC_NAME_INDEX = 8;
const PIPE_PARAMETERS_INDEX = 10;


export class StringLiteral implements Renderable {
    private readonly string: string;

    constructor(str: string) {
        this.string = StringLiteral.escapeHtml(str);
    }

    /** @inheritdoc */
    render(templates?: SimpleObject): string {
        if (!templates || !StringLiteral.probablyHasTemplates(this.string)) {
            return this.string;
        }

        return this.string.replace(TEMPLATE_TAG, (...groups) => {
            const key = groups[PIPE_KEY_INDEX];
            const pipeFunctionName = groups[PIPE_FUNC_NAME_INDEX];
            const pipeParameters = groups[PIPE_PARAMETERS_INDEX];
            const value = StringLiteral.getValueFromObject(templates, key);

            return Aych.Piper.pipe(value, pipeFunctionName, pipeParameters);
        });
    }

    /**
     * A quick check to see if a string has templates. This check does not
     * validate that the potential template is usable.
     * @param string
     */
    private static probablyHasTemplates(string: string) {
        return string.includes(TEMPLATE_START_TAG) && string.includes(TEMPLATE_END_TAG);
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

    /**
     * Get the value of a key from an object.
     * @param object the object to search
     * @param key A string representing the key of the value in the object that you are looking for. These follow
     * standard javascript syntax. For example:
     *     getFromObject({ array: [1, 2, 3, 4] }, 'array[2]') ===> 2
     *     getFromObject({ array: [{}, { key: 'value' }]}, 'array[1].key') ===> 'value'
     */
    private static getValueFromObject(object: SimpleObject, key: string): string {
        let keys = key.trim().split(".");
        let found = false;
        let track: any = object;
        let last: string | undefined = undefined;

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
            last = key;
            keys.shift()
        }

        return found ? track.toString() : '';
    }
}
