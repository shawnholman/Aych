import {SimpleObject} from "../interfaces";
import {Piper} from "./Piper";
import {Renderable} from "./Renderable";
import {isString} from "../Util";

const TEMPLATE_START_TAG = '{{';
const TEMPLATE_END_TAG = '}}';
const TEMPLATE_FILTER_PIPE = '|';

const TEMPLATE_BUFFERED_START_TAG = TEMPLATE_START_TAG + '\\s*';
const TEMPLATE_BUFFERED_END_TAG = '\\s*' + TEMPLATE_END_TAG;
const TEMPLATE_BUFFERED_FILTER_PIPE = '\\s*\\' + TEMPLATE_FILTER_PIPE + '\\s*';
const FULL_IDENTIFIER = '(([\\w-_][\\w\\d-_]*(\\[-?\\d+\\])?\\??)(\\.[\\w-_][\\w\\d-_]*(\\[-?\\d+\\])?\\??)*)';
const FILTER = '(' + TEMPLATE_BUFFERED_FILTER_PIPE + '(([\\w-_][\\w\\d-_]*)(\\((([\\w\\d]+)(,\\s*[\\w\\d]+)*)?\\))?))?';
const TEMPLATE_TAG =
    new RegExp(TEMPLATE_BUFFERED_START_TAG + FULL_IDENTIFIER + FILTER + TEMPLATE_BUFFERED_END_TAG, 'g');

const PIPE_KEY_INDEX = 1;
const PIPE_FUNC_NAME_INDEX = 8;
const PIPE_PARAMETERS_INDEX = 10;

/**
 * The StringLiteral class is the most basic building block of Aych that extends Renderable.
 * The StringLiteral holds a string that when rendered can parse templates.
 */
export class StringLiteral extends Renderable {
    private readonly string: string;

    /**
     * Constructor
     * @param str The underlying string
     */
    constructor(str: any, escape = true) {
        super();

        // if you try to pass anything that isn't a string in then convert it
        if (!isString(str)) {
            str = str.toString();
        }
        this.string = escape ? StringLiteral.escapeHtml(str) : str;
    }

    /** @inheritdoc */
    internalRender(templates: SimpleObject): string {
        if (!StringLiteral.probablyHasTemplates(this.string)) {
            return this.string;
        }

        return this.string.replace(TEMPLATE_TAG, (...groups) => {
            const key = groups[PIPE_KEY_INDEX];
            const pipeFunctionName = groups[PIPE_FUNC_NAME_INDEX];
            const pipeParameters = groups[PIPE_PARAMETERS_INDEX];
            const value = StringLiteral.getValueFromObject(templates, key);

            return Piper.pipe(value, pipeFunctionName, pipeParameters);
        });
    }

    /**
     * A quick check to see if a string has templates. This check does not
     * validate that the potential template is usable.
     * @param string The string to check if it has templates.
     */
    private static probablyHasTemplates(string: string) {
        return string.includes(TEMPLATE_START_TAG) && string.includes(TEMPLATE_END_TAG);
    }

    /**
     * Escapes HTML inside of a string.
     * @param unsafe The string to escape.
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
     * Gets the value of a key from an object.
     * @param object The object to search.
     * @param key A string representing the key of the value in the object that you are looking for. These follow
     * standard javascript syntax. For example:
     *     getFromObject({ array: [1, 2, 3, 4] }, 'array[2]') ===> 2
     *     getFromObject({ array: [{}, { key: 'value' }]}, 'array[1].key') ===> 'value'
     */
    private static getValueFromObject(object: SimpleObject, key: string): string {
        const keys = key.split(".").map(this.parseKey);
        let track: any = object;
        let prevKey: string | undefined = undefined;

        for (let key of keys) {
            // Key does not exist on track
            if (!Object.prototype.hasOwnProperty.call(track, key.value)) {
                if (key.isOptional) { // Does not matter if optional
                    return '';
                }
                if (prevKey === undefined) {
                    throw new Error(key.value + " is undefined.");
                }
                throw new Error(key.value + ` is not a property of ${prevKey}.`);
            }

            if (key.isArray) {
                const index = key.array!.index;
                const child = track[key.value];

                if (!Array.isArray(child)) {
                    throw new Error(key.value + ' is not an array.');
                }

                if (index < 0 || index >= child.length) {
                    if (key.isOptional) {
                        return '';
                    }
                    throw new Error(`Index out of bounds: ${key.value}[${index}].`);
                }
                track = child[index];
                prevKey = key.value;
                continue;
            }

            track = track[key.value];
            prevKey = key.value;
        }

        return track.toString();
    }

    /**
     * Converts a key into a token for template parsing
     * @param key Key to convert
     * @return
     * @private
     */
    private static parseKey(key: string) {
        key = key.trim();
        let isOptional = false;

        if (key.endsWith("?")) {
            isOptional = true;
            // remove the optional sign
            key = key.slice(0, -1);
        }

        // Checks to see if the key is an array. It should match: key[1] for example
        // the match would return ['key[1]', 'key', '1']
        const keyIsArray = key.match(/^([\w-_][\w\d-_]*)\[([-]?\d+)]$/);
        let index = -1;
        if (keyIsArray) {
            key = keyIsArray[1];
            index = parseInt(keyIsArray[2]);
        }

        return {
            value: key,
            isOptional: isOptional,
            isArray: !!keyIsArray,
            array: keyIsArray ? {
                index: index
            } : null,
        }
    }
}
