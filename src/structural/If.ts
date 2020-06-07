import {Renderable, SimpleObject} from "../interfaces";
import {isString} from "../Util";
import {StringLiteral} from "../core";

export class If implements Renderable {
    private readonly condition: boolean;
    private readonly element: Renderable;

    constructor(condition: boolean, element: Renderable | string) {
        this.condition = condition;

        if (isString(element)) {
            this.element = new StringLiteral(element);
        } else {
            this.element = element;
        }
    }

    /** @inheritdoc */
    render(templates?: SimpleObject): string {
        return this.condition ? this.element.render(templates) : '';
    }
}
