import {Renderable, SimpleObject} from "../interfaces";
import {isRenderable, isString} from "../Util";
import {StringLiteral} from "../core";

type EachRenderFunction = (item: string, index: number, items: Iterable<any>) => (Renderable | string);

/** Creates rendered elements based on an Iterable */
export class Each implements Renderable {
    private readonly items: Iterable<any>;
    private readonly element: Renderable;
    private readonly renderFunction: EachRenderFunction;

    constructor(items: Iterable<any>, element: EachRenderFunction | Renderable | string) {
        this.items = items;

        if (isString(element)) {
            this.element = new StringLiteral(element);
        } else if (isRenderable(element)) {
            this.element = element;
        } else {
            this.renderFunction = element;
        }
    }

    /** @inheritdoc */
    render(templates?: SimpleObject): string {
        if (this.element === undefined) {
            return this.renderByFunction(templates);
        } else {
            return this.renderByElement(templates);
        }
    }

    /**
     * Renders elements directly using a Renderable
     * @param templates
     */
    private renderByElement(templates?: SimpleObject): string {
        let render = '';
        let i = 0;
        for (let item of this.items) {
            let iteration = { item, i };
            render += this.element.render({ ...iteration, ...templates });
            i++;
        }
        return render;
    }

    /**
     * Renders elements using a function that generates the element.
     * @param templates
     */
    private renderByFunction(templates?: SimpleObject): string {
        let render = '';
        let i = 0;
        for (let item of this.items) {
            let element = this.renderFunction(item, i, this.items);
            let iteration = { item, i };

            if (isString(element)) {
                element = new StringLiteral(element);
            }

            render += element.render({ ...iteration, ...templates });
            i++;
        }
        return render;
    }
}
