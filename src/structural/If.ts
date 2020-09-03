import {SimpleObject} from "../interfaces";
import {isString} from "../Util";
import {Renderable} from "../core/Renderable";
import {StringLiteral} from "../core/StringLiteral";
import {TemplateParser} from "../core/TemplateParser";

/**
 * The If class renders a Renderable based on a condition.
 */
export class If extends Renderable {
    private readonly condition: boolean | string;
    private ifRenderable: Renderable;
    private elseRenderable?: Renderable;
    private elifRenderable?: Renderable;

    /**
     * Constructor
     * @param condition The condition that determines if the renderable gets rendered.
     * @param toRenderIf The renderable to render if the condition is true.
     * @param toRenderElse The renderable to render if the condition is false (and no truthy elif exists).
     */
    constructor(condition: boolean | string, toRenderIf?: Renderable | string, toRenderElse?: Renderable | string) {
        super();
        this.condition = condition;

        if (toRenderIf) {
            this.then(toRenderIf);
        }
        if (toRenderElse) {
            this.else(toRenderElse);
        }
    }

    /**
     * Sets the if renderable.
     * @param toRender The renderable to render if the condition is true (and no truthy elif exists).
     */
    then(toRender: Renderable | string): If {
        this.ifRenderable = isString(toRender) ? new StringLiteral(toRender) : toRender;
        return this;
    }

    /**
     * Sets the else renderable.
     * @param toRender The renderable to render if the condition is false (and no truthy elif exists).
     */
    else(toRender: Renderable | string): If {
        this.elseRenderable = isString(toRender) ? new StringLiteral(toRender) : toRender;
        return this;
    }

    /**
     * Adds a new elif block.
     * @param condition The condition that determines if the renderable gets rendered.
     * @param toRender The renderable to render if the condition is true (and the if renderable is false).
     */
    elif(condition: boolean, toRender: Renderable | string): If {
        // Only given that the original if condition is false, and the elif condition is true,
        // and no other elif has been found already then we can set elif.
        if (!this.condition && condition && this.elifRenderable === undefined) {
            this.elifRenderable = isString(toRender) ? new StringLiteral(toRender) : toRender;
        }
        return this;
    }

    /** @inheritdoc */
    protected internalRender(templates: SimpleObject): string {
        let condition = isString(this.condition) ? TemplateParser.evaluate(this.condition, templates) : this.condition;

        if (condition) {
            return this.ifRenderable.render(templates);
        } else if (this.elifRenderable !== undefined) {
            return this.elifRenderable.render(templates);
        } else {
            return this.elseRenderable ? this.elseRenderable.render(templates) : '';
        }
    }
}
