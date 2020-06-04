import {Attributes, Renderable} from './interfaces';
import {StringLiteral} from "./StringLiteral";

const CLASS_IDENTIFIER = '.';
const ID_IDENTIFIER = '#';

export class Element {
    private readonly tag: string;
    private id: string;
    private classes: string[];
    private attributes: Attributes;
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
     * @param tier3 The third level of parameters. This will either be a string child or another nested Element.
     * @param children A set of children elements.
     *
     * TODO: Each element should know its templates in an array. Parents will check this array to index the templates.
     * H.div(H.strong('{{some}}'), H.strong('{{else}}')).with({...}).render();
     */
    constructor(tag: string, tier1?: string | Renderable | Attributes, tier2?: string | Renderable | Attributes,  tier3?: string | Renderable, ...children: Renderable[]) {
        this.tag = tag;

        const tier1IsString = typeof tier1 === 'string';
        const tier1IsRenderable = this.isRenderable(tier1);
        const tier1IsAttribute = !tier1IsString && !tier1IsRenderable;
        const tier2IsString = typeof tier2 === 'string';
        const tier2IsRenderable  = this.isRenderable(tier1);
        const tier2IsAttribute = !tier2IsString && !tier2IsRenderable;
        const tier3IsString = typeof tier3 === 'string';

        if (tier1IsString) {
            if (Element.isIdentifierString(tier1 as string)) {
                this.setIdentifierString(tier1 as string);
            } else {
                this.children.push(new StringLiteral(tier1 as string));
            }
        } else if (tier1IsRenderable) {
            this.children.push(tier1 as Renderable);
        } else  {
            this.attributes = tier1 as Attributes;
        }

        if (tier2IsString) {
            this.children.push(new StringLiteral(tier2 as string));
        } else if (tier2IsRenderable) {
            this.children.push(tier2 as Renderable);
        } else {
            if (tier1IsAttribute && tier2IsAttribute) {
                throw new Error('Attribute field has been declared twice');
            }
            if (tier1IsRenderable || (tier1IsString && !Element.isIdentifierString(tier1 as string))) {
                throw new Error('Attribute must come before children');
            }
            this.attributes = tier2 as Attributes;
        }

        if (tier3IsString) {
            this.children.push(new StringLiteral(tier3 as string));
        } else {
            this.children.push(tier3 as Renderable);
        }

        if (children.length > 0) {
            this.children = this.children.concat(children);
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

    /** Get element list */
    getClass(): Array<string> {
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

    /**
     * Determines if parameter is a Renderable
     * @param param
     */
    private isRenderable(param?: string | Renderable | Attributes): param is Renderable {
        return (param as Renderable).render !== undefined;
    }

    /**
     * Determines if a string is an identifier string. An identifier string either starts with "#" or "." and specifies
     * a list of identifiers for an element. An example is "#book.col.col-xs-5". There can only be a single id and it
     * must be specified at the beginning. For example: ".col.col-xs-5#book" is not a valid identifier string.
     * @param tester
     */
    private static isIdentifierString(tester: string): boolean {
        const string = tester.trim();

        if (string.length === 0) {
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
        }
        this.classes = identifiers;
    }
}
