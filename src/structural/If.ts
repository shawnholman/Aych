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

    /** @inheritdoc */
    protected internalRender(templates: SimpleObject): string {
        if (this.condition) {
            return this.ifRenderable.render(templates);
        } else {
            return this.elseRenderable ? this.elseRenderable.render(templates) : '';
        }
    }
}
