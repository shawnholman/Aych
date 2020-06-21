import {Attributes, SimpleObject} from "../interfaces";
import {Element} from "./Element";
import {isAttributes, isRenderable, isString} from "../Util";
import {Renderable} from "../core/Renderable";
import {Group} from "../structural/Group";

/**
 * The NestableElement class represents elements that have an opening and closing tag.
 */
export class NestableElement extends Element {
    private children = new Group();

    /**
     * Constructs an nested element.
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
     */
    constructor(tag: string, tier1?: string | Renderable | Attributes, tier2?: string | Renderable | Attributes,  ...children: (Renderable|string)[]) {
        super(tag);

        if (isString(tier1) || isRenderable(tier1)) {
            if (isString(tier1) && Element.isIdentifierString(tier1)) {
                this.setIdentifierString(tier1);
            } else {
                this.addChild(tier1);
            }
        } else if (isAttributes(tier1)) {
            this.setAttributes(tier1);
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
            this.setAttributes(tier2);
        } else { // Tier 2 does not exist so we do not need to check further
            return;
        }

        if (children.length > 0) {
            this.setChildren(...children);
        }
    }

    /** Gets the children. */
    getChildren(): Renderable[] {
        return this.children.getMembers();
    }

    /**
     * Sets the children.
     * @param children one or more children
     */
    setChildren(...children: (Renderable | string)[]): Renderable {
        this.children.setMembers(...children);
        return this;
    }

    /**
     * Appends a child.
     * @param child either a string or renderable
     */
    addChild(child: Renderable | string): Renderable {
        this.children.addMember(child);
        return this;
    }

    /** @inheritdoc */
    protected internalRender(templates: SimpleObject): string {
        const tag = this.getTag();
        const attributes = this.getHtmlAttributeList();
        const children = this.children.render(templates);
        return `<${tag}${attributes}>${children}</${tag}>`;
    }
}
