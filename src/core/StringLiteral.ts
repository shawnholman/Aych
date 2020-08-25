import {SimpleObject} from "../interfaces";
import {TemplateParser} from "./TemplateParser";
import {Renderable} from "./Renderable";
import {isString} from "../Util";

/** @internal */
const templatingTags = {
    start: '{{',
    end: '}}',
    pipe: '|',
};

/** @internal */
const bufferedTemplatingTags = {
    start: templatingTags.start + '\\s*',
    end: '\\s*' + templatingTags.end,
    pipe: '\\s*\\' + templatingTags.pipe + '\\s*',
};

/** @internal */
const FULL_IDENTIFIER = '(([\\w-_][\\w\\d-_]*(\\[-?\\d+\\])?\\??)(\\.[\\w-_][\\w\\d-_]*(\\[-?\\d+\\])?\\??)*)';

/** @internal */
const FILTER = '(' + (bufferedTemplatingTags.pipe) + '(([\\w-_][\\w\\d-_]*)(\\((([\\w\\d]+)(,\\s*[\\w\\d]+)*)?\\))?))?';

/** @internal */
const TEMPLATE_TAG =
    new RegExp(bufferedTemplatingTags.start + FULL_IDENTIFIER + FILTER + bufferedTemplatingTags.end, 'g');

/** @internal */
const templateIndex = {
    key: 1,
    pipeFuncName: 8,
    pipeParams: 10,
};

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
        return TemplateParser.template(this.string, templates);
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
}