import {Attributes, Renderable, SimpleObject} from "./interfaces";
import {isString} from "./Util";
import {StringLiteral} from "./StringLiteral";

export class If implements Renderable {
    private condition: boolean;
    private element: Renderable;

    constructor(condition: boolean, element: Renderable | string) {
        this.condition = condition;

        if (isString(element)) {
            this.element = new StringLiteral(element);
        } else {
            this.element = element;
        }
    }

    render(templates?: SimpleObject): string {
        return this.condition ? this.element.render(templates) : '';
    }
}
