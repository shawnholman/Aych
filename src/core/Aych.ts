import {EmptyElement} from "../elements/EmptyElement";
import {NestableElement} from "../elements/NestableElement";
import {Piper} from "./Piper";
import {Renderable} from "./Renderable";
import {Attributes, SimpleObject} from "../interfaces";
import {StringLiteral} from "./StringLiteral";
import {Each, EachRenderFunction} from "../structural/Each";
import {Group} from "../structural/Group";
import {If} from "../structural/If";
import {Switch, Switchable} from "../structural/Switch";
import {kebabToCamelCase, isRenderable, isString} from "../Util";
import {Element} from "../elements/Element";

/** Matches a valid HTML tag name */
const VALID_HTML_TAG_NAME = /^[a-zA-Z][a-zA-Z0-9]*(-[a-zA-Z]+)*$/g;

/** Matches a valid name for a composition */
const VALID_COMPOSITION_NAME = /^[a-zA-Z]+$/g;
/**
 * The Aych class exposes all of the libraries features in an encapsulated package.
 */
export class Aych {
    private static scoped: Array<string> = [];
    private static isScoped = false;
    /**
     * TODO: [p2] Find a use case or remove for now.
    private static strictMode = true;

    static setStrictMode(mode: boolean) {
        Aych.strictMode = mode;
    }

    static isStrictMode() {
        return this.strictMode;
    }
     */

    /**
     * Factory for creating element factories.
     * @param elType The type of element to create.
     * @param tagName The name of the tag that is used.
     */
    static create(elType: Aych.ElementType, tagName: string): string {
        tagName = tagName.trim();
        if (!tagName.match(VALID_HTML_TAG_NAME)) {
            throw new Error('Tag names should start with a letter and only contain letters, numbers, and dashes between two characters (yes: the-tag-name, no: the---tag---name).');
        }

        // The name to use for the actual define
        const tagDefinitionName = kebabToCamelCase(tagName);
        if (elType == Aych.ElementType.NESTED) {
            // Create a nestable element factory on Aych
            const element = function (tier1?: string | Renderable | Attributes, tier2?: string | Renderable | Attributes,  ...children: (Renderable|string)[]) {
                return new NestableElement(tagName, tier1, tier2, ...children);
            };
            Aych.define(tagDefinitionName, element);
        } else if (elType == Aych.ElementType.EMPTY) {
            // Create am empty element factory on Aych
            const element = function (tier1?: string | Attributes, tier2?: Attributes) {
                return new EmptyElement(tagName, tier1, tier2);
            };
            Aych.define(tagDefinitionName, element);
        } else {
            throw new Error('ElementType does not exist: ' + elType);
        }
        return tagName;
    }

    /**
     * Remove a created tag or composition.
     * @param name Name of the tag or composition.
     */
    static destroy(name: string) {
        name = kebabToCamelCase(name.trim());
        if (Object.prototype.hasOwnProperty.call(Aych.prototype, name)) {
            delete Aych.prototype[name];
        }
    }

    /**
     * Defines a method on Aych that when called returns back a Renderable. These are
     * known as composables.
     * @param name Name of the composable.
     * @param composition The method that the defines what arguments the composable takes
     * and which renderable it returns.
     */
    static compose(name: string, composition: (...args: any[]) => Renderable): void {
        name = name.trim();
        if (!name.match(VALID_COMPOSITION_NAME)) {
            throw new Error('Composition names should start with a letter or underscore and only contain letters, numbers, dashed, and underscores throughout.');
        }
        Aych.define(name, composition);
    }

    /**
     * Converts a javascript string literal into an Aych StringLiteral.
     * @param str The string literal to convert.
     */
    string(str: any): StringLiteral {
        if (!isString(str)) {
            str = str.toString();
        }
        return new StringLiteral(str);
    }

    /**
     * Converts a javascript string literal into an unescaped StringLiteral.
     * @param str The string literal to convert.
     */
    unescaped(str: any): StringLiteral {
        return new StringLiteral(str, false);
    }

    // ---------- Statements prefixed by $ ----------

    // @ts-ignore
    $(scope: (self: Aych) => void | string | Renderable): void | string {
        Aych.isScoped = true;
        const callerResult = scope.call(null, this);
        Aych.isScoped = false;
        Aych.scoped.forEach(Aych.destroy);

        if (isRenderable(callerResult)) {
            return callerResult.render();
        } else if (isString(callerResult)) {
            return callerResult;
        }
    }

    /** @inheritDoc from Constructor of Each */
    $each(items: Iterable<any>, renderable: EachRenderFunction | Renderable | string, indexName?: string, itemName?: string): Each {
        return new Each(items, renderable, indexName, itemName);
    }

    /**
     * Iterate through an object.
     * @param items An object to iterate through.
     * @param renderable The renderable to iterate.
     */
    $eachIn(items: SimpleObject, renderable: EachRenderFunction | Renderable | string): Each {
        return new Each(Object.entries(items), renderable);
    }

    /**
     * Render an element x number of times.
     * @param times Number of times to render.
     * @param renderable The renderable to render.
     */
    $repeat(times: number, renderable: EachRenderFunction | Renderable | string) {
        return new Each([...Array(times).keys()], renderable);
    }

    /** @inheritDoc from Constructor of Group */
    $group (...members: (Renderable|string)[]): Group {
        return new Group(...members);
    }

    /** @inheritDoc from Constructor of If */
    $if (condition: boolean, ifRenderable: Renderable | string, elseRenderable?: Renderable | string): If {
        return new If(condition, ifRenderable, elseRenderable);
    }

    /** @inheritDoc from Constructor of Switch */
    $switch (value: Switchable, ...cases: Switch.Case<Switchable>[]): Switch<Switchable> {
        if (isString(value)) {
            return new Switch(value as string, ...cases as Switch.Case<string>[]);
        } else {
            return new Switch(value as number, ...cases as Switch.Case<number>[]);
        }
    }

    /** @inheritDoc from Constructor of Switch.Case */
    // @ts-ignore that the return type is not a renderable (an exception)
    $case (value: Switchable, renderable: Renderable | string): Switch.Case<Switchable> {
        if (isString(value)) {
            return new Switch.Case(value as string, renderable);
        } else {
            return new Switch.Case(value as number, renderable);
        }
    }

    /**
     * Exported Piper
     */
    static Piper = Piper;

    /**
     * Defines a property on Aych's prototype.
     * @param name Name of the property.
     * @param value Value of the property.
     * @param configurable If the property can be configured.
     * @param writable If the property can be written.
     */
    private static define(name: string, value: any, configurable = true, writable = false): void {
        let propertyName = name.trim();

        if (Object.prototype.hasOwnProperty.call(Aych.prototype, propertyName)) {
            throw new Error(`You cannot define ${propertyName} on Aych because it already exists. Please call Aych.destroy("${propertyName}") before redefining.`);
        }
        // Pushed scoped variables for deletion.
        if (Aych.isScoped) {
            Aych.scoped.push(propertyName);
        }
        Object.defineProperty(Aych.prototype, propertyName, { value, configurable, writable });
    }

    [dynamicProperty: string]: (...args: any[]) => Renderable;
}

export namespace Aych {
    export enum ElementType {
        NESTED,
        EMPTY,
    }
}

const nestedElements = [
    'a',
    'abbr',
    'address',
    'article',
    'aside',
    'audio',
    'b',
    'bdi',
    'bdo',
    'blockquote',
    'body',
    'button',
    'canvas',
    'caption',
    'cite',
    'code',
    'colgroup',
    'data',
    'datalist',
    'dd',
    'del',
    'details',
    'dfn',
    'dialog',
    'div',
    'dl',
    'dt',
    'em',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'header',
    'html',
    'i',
    'iframe',
    'ins',
    'kbd',
    'label',
    'legend',
    'li',
    'main',
    'map',
    'mark',
    'meter',
    'nav',
    'noscript',
    'object',
    'ol',
    'optgroup',
    'option',
    'output',
    'p',
    'picture',
    'pre',
    'progress',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'script',
    'section',
    'select',
    'small',
    'span',
    'strong',
    'style',
    'sub',
    'summary',
    'sup',
    'svg',
    'table',
    'tbody',
    'td',
    'template',
    'textarea',
    'tfoot',
    'th',
    'thead',
    'time',
    'title',
    'tr',
    'u',
    'ul',
    'var',
    'video'
];
nestedElements.forEach((tag) => Aych.create(Aych.ElementType.NESTED, tag));

const emptyElements = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
];
emptyElements.forEach((tag) => Aych.create(Aych.ElementType.EMPTY, tag));