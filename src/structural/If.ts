import {Renderable, SimpleObject} from "../interfaces";
import {isString} from "../Util";
import {StringLiteral} from "../core";
import {Each} from "./Each";

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

    /** @inheritdoc */
    each(items: Iterable<any>, templates?: SimpleObject): string {
        return new Each(items, this).render(templates);
    }

    /** @inheritdoc */
    repeat(x: number, templates?: SimpleObject): string {
        return new Each([...Array(x).keys()], this).render(templates);
    }

    /** @inheritdoc */
    if(condition: boolean, templates?: SimpleObject): string {
        return new If(condition, this).render(templates);
    }
}
