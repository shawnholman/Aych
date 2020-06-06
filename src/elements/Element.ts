import {Attributes, Renderable} from '../interfaces';
import {StringLiteral} from "../StringLiteral";
import {isAttributes, isRenderable, isString} from "../Util";

const CLASS_IDENTIFIER = '.';
const ID_IDENTIFIER = '#';

export abstract class Element {
    private readonly tag: string;
    private id: string;
    private classes: string[] = [];
    private attributes: Attributes = {};
    private children: Renderable[] = [];

    /**
     * Constructs an element
     * @param tag tag name of the element
     * @param tier1 The first level of parameters. If this parameter is a string, but it is not an identifier string,
     * then it will be treated a string child and nothing should follow it. If this parameter is a string, and is an identifier string, then it
     * will set the id and classes of the element. If this parameter is an Element, then it will become a child and
     * every following parameter will need to be an Element as well. If this parameter is an Attributes, then it will set
     * the attributes of the element and will need to be followed by either a string (as a child), an Element, or
     * nothing.
     * @param tier2 The second level of parameters. If this parameter is a string then it will be treated a string
     * child and nothing should follow it. If this parameter is an Element, then it will become a child and
     * every following parameter will need to be an Element as well. If this parameter is an Attributes, then it will
     * set the attributes of the element and will need to be followed by a set of Elements or none.
     * @param children A set of children elements.
     *
     * TODO: Each element should know its templates in an array. Parents will check this array to index the templates.
     * H.div(H.strong('{{some}}'), H.strong('{{else}}')).with({...}).render();
     */
    constructor(tag: string, tier1?: string | Renderable | Attributes, tier2?: string | Renderable | Attributes,  ...children: (Renderable|string)[]) {
        this.tag = tag;

        if (isString(tier1) || isRenderable(tier1)) {
            if (isString(tier1) && Element.isIdentifierString(tier1)) {
                this.setIdentifierString(tier1);
            } else {
                this.addChild(tier1);
            }
        } else if (isAttributes(tier1)) {
            this.attributes = tier1;
        } else { // Tier 1 does not exist so we do not need to check further
            return;
        }

        if (isString(tier2) || isRenderable(tier2)) {
            this.addChild(tier2);
        } else if (isAttributes(tier2)) {
            if (isAttributes(tier1) && isAttributes(tier2)) {
                throw new Error('Attributes field has been declared twice.');
            }
            if (isRenderable(tier2) || (isString(tier1) && !Element.isIdentifierString(tier1))) {
                throw new Error('Attributes must come before children.');
            }
            this.attributes = tier2;
        } else { // Tier 2 does not exist so we do not need to check further
            return;
        }

        if (children.length > 0) {
            this.setChildren(...children);
        }
    }

    // ---------------------- GETTERS ----------------------

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

    /** Get children */
    getChildren(): Renderable[] {
        return this.children;
    }

    /** Get attributes */
    getAttributes(): Attributes {
        return this.attributes;
    }

    // ---------------------- SETTERS ---------------------/

    /** Get element id */
    setId(id: string): void {
        this.id = id;
    }

    /** Set element class list */
    setClassList(classes: Array<string>): void {
        this.classes = classes;
    }

    /** Set the identifiers */
    setIdentifiers(identifier: string): void {
        if (Element.isIdentifierString(identifier)) {
            this.setIdentifierString(identifier);
        }
    }

    /**
     * Set children
     * @param children one or more chidren
     */
    setChildren(...children: (Renderable | string)[]): void {
        for (let child of children) {
            this.addChild(child);
        }
    }

    /**
     * Append a child.
     * @param child either a string or renderable
     */
    addChild(child: Renderable | string): void {
        if (isString(child)) {
            // empty strings do not require an object made
            if (child.trim().length === 0) {
                return;
            } else {
                child = new StringLiteral(child);
            }
        }
        this.children.push(child);
    }

    /**
     * Sets the attributes
     * @param attributes
     */
    setAttributes(attributes: Attributes): void {
        this.attributes = attributes;
    }

    // ---------------------- PRIVATE ---------------------

    /**
     * Determines if a string is an identifier string. An identifier string either starts with "#" or "." and specifies
     * a list of identifiers for an element. An example is "#book.col.col-xs-5". There can only be a single id and it
     * must be specified at the beginning. For example: ".col.col-xs-5#book" is not a valid identifier string.
     * @param tester
     */
    private static isIdentifierString(tester: string): boolean {
        const string = tester.trim();

        // identifier string can't be empty and must start with either "." or "#"
        if (string.length === 0 || (!string.startsWith("#") && !string.startsWith("."))) {
            return false;
        }
        return string
            .replace(/(#[A-z-_][A-z0-9-_]*)?([.][A-z-_][A-z0-9-_]*)*/, '') === '';
    }

    /**
     * Set's the id and classes of the element given an identifier string.
     * @param identifier An identifier string either starts with "#" or "." and specifies
     * a list of identifiers for an element. An example is "#book.col.col-xs-5". There can only be a single id and it
     * must be specified at the beginning. For example: ".col.col-xs-5#book" is not a valid identifier string.
     */
    private setIdentifierString(identifier: string): void {
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
}
