import {SimpleObject} from "../interfaces";
import {Piper} from "./Piper";

export class Templater {
    private static readonly tags = {
        start: '{{',
        end: '}}',
        pipe: '|',
    };

    private static readonly bufferedTags = {
        start: Templater.tags.start + '\\s*',
        end: '\\s*' + Templater.tags.end,
        pipe: '\\s*\\' + Templater.tags.pipe + '\\s*',
    };

    private static readonly FULL_IDENTIFIER =
        '(([\\w-_][\\w\\d-_]*(\\[-?\\d+\\])?\\??)(\\.[\\w-_][\\w\\d-_]*(\\[-?\\d+\\])?\\??)*)';

    private static readonly FILTER =
        '(' + (Templater.bufferedTags.pipe) + '(([\\w-_][\\w\\d-_]*)(\\((([\\w\\d]+)(,\\s*[\\w\\d]+)*)?\\))?))?';

    private static readonly TEMPLATE_TAG =
        new RegExp(Templater.bufferedTags.start + Templater.FULL_IDENTIFIER + Templater.FILTER + Templater.bufferedTags.end, 'g')

    /** Indexes used to identify key locations in the resulting RegExp match */
    private static readonly templateIndex = {
        // Matches the name of the object key we are looking for.
        key: 1,
        // Matches the pipe function name
        pipeFuncName: 8,
        // Matches the list of pipe params
        pipeParams: 10,
    }

    public static template(toTemplate: string, templates: SimpleObject) {
        if (!Templater.probablyHasTemplates(toTemplate)) {
            return toTemplate;
        }

        return toTemplate.replace(Templater.TEMPLATE_TAG, (...groups) => {
            const key = groups[Templater.templateIndex.key];
            const pipeFunctionName = groups[Templater.templateIndex.pipeFuncName];
            const pipeParameters = groups[Templater.templateIndex.pipeParams];
            const value = Templater.getValueFromObject(templates, key);

            return Piper.pipe(value, pipeFunctionName, pipeParameters);
        });
    }

    /**
     * A quick check to see if a string has templates. This check does not
     * validate that the potential template is usable.
     * @param string The string to check if it has templates.
     */
    private static probablyHasTemplates(toTemplate: string) {
        return toTemplate.includes(Templater.tags.start) && toTemplate.includes(Templater.tags.end);
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