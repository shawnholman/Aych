import {SimpleObject} from "../interfaces";
import {isString} from "../Util";
import {Renderable, StringLiteral} from "../core";

export class If extends Renderable {
    private readonly condition: boolean;
    private readonly element: Renderable;

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
