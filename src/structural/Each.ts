import {SimpleObject} from "../interfaces";
import {isRenderable, isString} from "../Util";
import {Renderable, StringLiteral} from "../core";

type EachRenderFunction = (item: string, index: number, items: Iterable<any>) => (Renderable | string);

/**
 * TODO: [P2] Add support for object literals (SimpleObject) for iterating through.
 */

/** Creates rendered elements based on an Iterable */
export class Each extends Renderable {
    private readonly items: Iterable<any>;
    private readonly element: Renderable;
    private readonly renderFunction: EachRenderFunction;

    private indexString: string;
    private itemString: string;

    constructor(items: Iterable<any>, element: EachRenderFunction | Renderable | string, indexString = 'i', itemString = 'item') {
        super();
        this.items = items;
        this.indexString = indexString;
        this.itemString = itemString;

        if (isString(element)) {
            this.element = new StringLiteral(element);
        } else if (isRenderable(element)) {
            this.element = element;
        } else {
            this.renderFunction = element;
        }
    }

    /** @inheritdoc */
    protected internalRender(templates: SimpleObject): string {
        if (this.element === undefined) {
            return this.renderByFunction(templates);
        } else {
            return this.renderByElement(templates);
        }
    }

    /**
     * Sets the index variable name used for the template generated by the each method.
     * @param indexString
     */
    setIndexString(indexString: string) {
        this.indexString = indexString;
        return this;
    }

    /**
     * Sets the item variable name used for the template generated by the each method.
     */
    setItemString(itemString: string) {
        this.itemString = itemString;
        return this;
    }

    /**
     * Renders elements directly using a Renderable
     * @param templates
     */
    private renderByElement(templates?: SimpleObject): string {
        let render = '';
        let i = 0;
        for (let item of this.items) {
            let iteration = {
                [this.itemString]: item,
                [this.indexString]: i,
            };
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
            let iteration = {
                [this.itemString]: item,
                [this.indexString]: i,
            };

            if (isString(element)) {
                element = new StringLiteral(element);
            }

            render += element.render({ ...iteration, ...templates });
            i++;
        }
        return render;
    }
}

/**
H.each([1,2,3], H.div(' {{item}} ', H.each([3,4,5], '{{item}}')))
    -> "<div> 1 345 2 345 3 345</div>"

H.each([1,2,3], H.div(' {{outer}} ', H.each([3,4,5], '{{item}}:{{outer}}'))).setItemString('outer');
-> "<div> 1 1:31:41:5 2 2:32:42:5 3 3:33:43:5</div>"

 */
