import {SimpleObject} from "../interfaces";
import {isString} from "../Util";
import {Renderable, StringLiteral} from "../core";

/**
 * The If class renders a Renderable based on a condition.
 */
export class If extends Renderable {
    private readonly condition: boolean;
    private readonly element: Renderable;

    /**
     * Constructor
     * @param condition THe condition that determines if the element gets rendered.
     * @param element The element to render.
     */
    constructor(condition: boolean, element: Renderable | string) {
        super();
        this.condition = condition;

        if (isString(element)) {
            this.element = new StringLiteral(element);
        } else {
            this.element = element;
        }
    }

    /** @inheritdoc */
    protected internalRender(templates: SimpleObject): string {
        return this.condition ? this.element.render(templates) : '';
    }
}
