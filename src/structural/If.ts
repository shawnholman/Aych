import {SimpleObject} from "../interfaces";
import {isString} from "../Util";
import {Renderable} from "../core/Renderable";
import {StringLiteral} from "../core/StringLiteral";

/**
 * The If class renders a Renderable based on a condition.
 */
export class If extends Renderable {
    private readonly condition: boolean;
    private readonly ifRenderable: Renderable;
    private elseRenderable?: Renderable;
    private elifRenderable?: Renderable;

    /**
     * Constructor
     * @param condition THe condition that determines if the renderable gets rendered.
     * @param ifRenderable The renderable to render if the condition is true.
     * @param elseRenderable The renderable to render if the condition is false.
     */
    constructor(condition: boolean, ifRenderable: Renderable | string, elseRenderable?: Renderable | string) {
        super();
        this.condition = condition;

        this.ifRenderable = isString(ifRenderable) ? new StringLiteral(ifRenderable) : ifRenderable;

        if (elseRenderable) {
            this.else(elseRenderable);
        }
    }

    /**
     * Sets the else renderable.
     * @param elseRenderable The renderable to render if the condition is false.
     */
    else(elseRenderable: Renderable | string): Renderable {
        this.elseRenderable = isString(elseRenderable) ? new StringLiteral(elseRenderable) : elseRenderable;
        return this;
    }

    /**
     * Add a new elif block.
     * @param elifRenderable The renderable to try and render when the if block does not run.
     */
    elif(condition: boolean, elifRenderable: Renderable | string): If {
        // Only given that the original if condition is false, and the elif condition is true,
        // and no other elif has been found already then we can set elif.
        if (!this.condition && condition && this.elifRenderable === undefined) {
            this.elifRenderable = isString(elifRenderable) ? new StringLiteral(elifRenderable) : elifRenderable;
        }
        return this;
    }

    /** @inheritdoc */
    protected internalRender(templates: SimpleObject): string {
        if (this.condition) {
            return this.ifRenderable.render(templates);
        } else if (this.elifRenderable !== undefined) {
            return this.elifRenderable.render(templates);
        } else {
            return this.elseRenderable ? this.elseRenderable.render(templates) : '';
        }
    }
}
