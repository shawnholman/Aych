import {Attribute, Attributes} from "../interfaces";
import {Renderable} from "../core/Renderable";
import {isAttributes, isString} from "../Util";

const CLASS_IDENTIFIER = '.';
const ID_IDENTIFIER = '#';

/**
 * The Element class is the base class for all elements. This class defines properties and attributes
 * that a fundamental for the creation of elements.
 */
export abstract class Element extends Renderable {
    private readonly tag: string;
    private attributes: Attributes = {};

    /**
     * Constructs an element
     * @param tag The tag name of the element.
     * @param tier1 Either a string representing the identifier string or a list of attributes.
     * @param tier2 A list of attributes, accepted ONLY IF tier1 is not an attribute.
     */
    constructor(tag: string, tier1?: string | Attributes, tier2?: Attributes) {
        super();

        // Assign the tag name. Make it lower case because HTML tags are typically lower cased.
        this.tag = tag.toLowerCase();

        if (isString(tier1)) {
            if (isString(tier1) && Element.isIdentifierString(tier1)) {
                this.setIdentifierString(tier1);
            }
        } else if (isAttributes(tier1)) {
            this.setAttributes(tier1);
        } else { // Tier 1 does not exist so we do not need to check further
            return;
        }

        if (isAttributes(tier2)) {
            if (isAttributes(tier1) && isAttributes(tier2)) {
                throw new Error('Attributes field has been declared twice.');
            }
            this.setAttributes(tier2);
        }
    }

    /** Get element tag */
    getTag(): string {
        return this.tag;
    }

    /** Get element id */
    getId(): string | null {
        if (!Object.prototype.hasOwnProperty.call(this.attributes, 'id')) {
            return null;
        }
        return this.attributes['id'] as string;
    }

    /** Get element class list */
    getClassList(): Array<string> {
        if (!Object.prototype.hasOwnProperty.call(this.attributes, 'class')) {
            return [];
        }
        return (this.attributes['class'] as string).split(" ");
    }

    /** Get attributes */
    getAttributes(): Attributes {
        return this.attributes;
    }

    /**
     * Set the ID.
     * @param id The new id.
     */
    setId(id: string): Element {
        this.setAttribute('id', id);
        return this;
    }

    /**
     * Sets the elements class list.
     * @param classes The new set of classes that the element will get.
     */
    setClassList(classes: Array<string>): Element {
        if (classes.length) {
            this.setAttribute('class', classes.join(" "));
        }
        return this;
    }

    /**
     * Set the identifiers.
     * @param identifier An identifier string. See isIdentifierString for more information.
     */
    setIdentifiers(identifier: string): Element {
        if (Element.isIdentifierString(identifier)) {
            this.setIdentifierString(identifier);
        } else { // We are going to excuse a non-valid identifier string for now.
            console.warn('Identifier string was not valid. Setter had no effect.');
        }
        return this;
    }

    /**
     * Sets the attributes
     * @param attributes
     */
    setAttributes(attributes: Attributes): Element {
        for (let attribute in attributes) {
            this.setAttribute(attribute, attributes[attribute]);
        }
        return this;
    }

    setAttribute(name: string, attribute: Attribute): Element {
        this.attributes[name] = attribute;
        return this;
    }

    /**
     * Determines if a string is an identifier string. An identifier string either starts with "#" or "." and specifies
     * a list of identifiers for an element. An example is "#book.col.col-xs-5". There can only be a single id and it
     * must be specified at the beginning. For example: ".col.col-xs-5#book" is not a valid identifier string.
     * @param tester
     */
    protected static isIdentifierString(tester: string): boolean {
        const string = tester.trim();

        // identifier string can't be empty and must start with either "." or "#"
        if (string.length === 0) {
            return false;
        }
        return string.match(/^(#[A-z-_][A-z0-9-_]*)?([.][A-z-_][A-z0-9-_]*)*$/) !== null;
    }

    /**
     * Set's the id and classes of the element given an identifier string.
     * @param identifier An identifier string. See isIdentifierString for more information.
     */
    protected setIdentifierString(identifier: string): void {
        const identifiers = identifier.trim().split(CLASS_IDENTIFIER);
        if (identifiers[0].startsWith(ID_IDENTIFIER)) {
            this.setId(identifiers!.shift()!.substr(1));
        } else {
            // Else, it starts with a "." which results in a beginning empty string
            // that we need to remove.
            identifiers.shift();
        }
        this.setClassList(identifiers);
    }

    /** Given an object of attributes, converts attributes into the HTML equivalent list. */
    protected getHtmlAttributeList(): string {
        const attributesEntries = Object.entries(this.getAttributes());

        return attributesEntries.reduce((str, [name, value]) => {
            // If the attribute is an array like: [true, 'trueAttr', 'falseAttr']
            // Then if true, use: 'trueAttr", else use: 'falseAttr'
            if (Array.isArray(value)) {
                // If the boolean element is true
                if (value[0]) { // We should use the second element
                    value = value[1] as (string|null);
                } else if (value.length === 3) {
                    // If the third element exists (and we already proved the boolean element is false) then
                    // we should use the else text.
                    value = value[2] as (string|null);
                } else {
                    // If false without an else, then we do not include this attribute at all.
                    return str;
                }
            }

            // A null value indicates that the attribute has no value.
            // An attribute like multiple on select would do this: <select multiple></select>
            if (value === null) {
                return str + ' ' + name;
            }
            return str + ` ${name}="${value}"`;
        }, '');
    }
}
