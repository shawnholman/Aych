import {SimpleObject} from "../interfaces";
import {isString} from "../Util";
import {Renderable, StringLiteral} from "../core";

/**
 * The If class renders a Renderable based on a condition.
 */
export class If extends Renderable {
    private readonly condition: boolean;
    private readonly ifElement: Renderable;
    private elseElement?: Renderable;

    /**
     * Constructor
     * @param condition THe condition that determines if the element gets rendered.
     * @param ifElement The element to render if the condition is true.
     * @param elseElement The element to render if the condition is false.
     */
    constructor(condition: boolean, ifElement: Renderable | string, elseElement?: Renderable | string) {
        super();
        this.condition = condition;

        this.ifElement = isString(ifElement) ? new StringLiteral(ifElement) : ifElement;

        if (elseElement) {
            this.else(elseElement);
        }
    }

    /**
     * Sets the else element.
     * @param elseElement The element to render if the condition is false.
     */
    else(elseElement: Renderable | string): Renderable {
        this.elseElement = isString(elseElement) ? new StringLiteral(elseElement) : elseElement;
        return this;
    }

    /** @inheritdoc */
    protected internalRender(templates: SimpleObject): string {
        if (this.condition) {
            return this.ifElement.render(templates);
        } else {
            return this.elseElement ? this.elseElement.render(templates) : '';
        }
    }
}
