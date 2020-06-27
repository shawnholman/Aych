import {Attributes} from "../interfaces";
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
    private id: string;
    private classes: string[] = [];
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
            this.attributes = tier1;
        } else { // Tier 1 does not exist so we do not need to check further
            return;
        }

        if (isAttributes(tier2)) {
            if (isAttributes(tier1) && isAttributes(tier2)) {
                throw new Error('Attributes field has been declared twice.');
            }
            this.attributes = tier2;
        }
    }

    /** Get element tag */
    getTag(): string {
        return this.tag;
    }

    /** Get element id */
    getId(): string {
        return this.id;
    }

    /** Get element class list */
    getClassList(): Array<string> {
        return this.classes;
    }

    /** Get attributes */
    getAttributes(): Attributes {
        return this.attributes;
    }

    /**
     * Set the ID.
     * @param id The new id.
     */
    setId(id: string): void {
        this.id = id;
    }

    /**
     * Sets the elements class list.
     * @param classes The new set of classes that the element will get.
     */
    setClassList(classes: Array<string>): void {
        this.classes = classes;
    }

    /**
     * Set the identifiers.
     * @param identifier An identifier string. See isIdentifierString for more information.
     */
    setIdentifiers(identifier: string): void {
        if (Element.isIdentifierString(identifier)) {
            this.setIdentifierString(identifier);
        } else { // We are going to excuse a non-valid identifier string for now.
            console.warn('Identifier string was not valid. Setter had no effect.');
        }
    }

    /**
     * Sets the attributes
     * @param attributes
     */
    setAttributes(attributes: Attributes): void {
        this.attributes = attributes;
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
            this.id = identifiers!.shift()!.substr(1);
        } else {
            // Else, it starts with a "." which results in a beginning empty string
            // that we need to remove.
            identifiers.shift();
        }
        this.classes = identifiers;
    }

    /** Given an object of attributes, converts attributes into the HTML equivalent list. */
    protected getHtmlAttributeList(): string {
        const attributesEntries = Object.entries(this.getAttributes());

        if (this.getClassList().length > 0) {
            const classString = this.getClassList().join(" ");
            attributesEntries.unshift(['class', classString]);
        }
        if (this.getId()) {
            attributesEntries.unshift(['id', this.getId()]);
        }

        return attributesEntries.reduce((str, [name, value]) => {
            if (value === null) {
                return str + ' ' + name;
            }
            return str + ` ${name}="${value}"`;
        }, '');
    }
}
