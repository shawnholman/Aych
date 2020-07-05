import {SimpleObject} from "../interfaces";
import {isRenderable, isString, merge} from "../Util";
import {Renderable} from "../core/Renderable";
import {StringLiteral} from "../core/StringLiteral";

export type EachRenderFunction = (item: any, index: number, items: Iterable<any>) => (Renderable | string);

/**
 * The Each class creates rendered renderables based on an Iterable.
 */
export class Each extends Renderable {
    private readonly items: Iterable<any>;
    private readonly renderable: Renderable;
    private ifEmptyRenderable: Renderable;
    private readonly renderFunction: EachRenderFunction;

    private indexName: string;
    private itemName: string;

    /**
     * Construct the each statement
     * @param items The items used to iterate through.
     * @param renderable The renderable to create for each item in items.
     * @param indexName The index name used for the template string for each renderable.
     * @param itemName The item name used for the template string for each renderable.
     */
    constructor(items: Iterable<any>, renderable: EachRenderFunction | Renderable | string, indexName = 'i', itemName = 'item') {
        super();
        this.items = items;
        this.indexName = indexName;
        this.itemName = itemName;

        if (isString(renderable)) {
            this.renderable = new StringLiteral(renderable);
        } else if (isRenderable(renderable)) {
            this.renderable = renderable;
        } else {
            this.renderFunction = renderable;
        }
    }

    /**
     * Sets the empty renderable which gets used if the list is empty.
     * @param renderable The renderable that gets used if the list is empty.
     */
    empty(renderable: Renderable | string): Each {
        this.ifEmptyRenderable = isString(renderable) ? new StringLiteral(renderable) : renderable;
        return this;
    }

    /**
     * Sets the index variable name used for the template generated by the each method.
     * @param indexName The new index name.
     */
    setIndexName(indexName: string): Each {
        this.indexName = indexName;
        return this;
    }

    /**
     * Sets the item variable name used for the template generated by the each method.
     * @param itemName The new item name.
     */
    setItemName(itemName: string): Each {
        this.itemName = itemName;
        return this;
    }

    /** @inheritdoc */
    protected internalRender(templates: SimpleObject): string {
        // If no items are present we should check the ifEmptyRenderable.
        if (this.isEmpty()) {
            return this.ifEmptyRenderable ? this.ifEmptyRenderable.render() : '';
        }

        if (this.renderable === undefined) {
            return this.renderByFunction(templates);
        } else {
            return this.renderByRenderable(templates);
        }
    }

    /**
     * Renders renderables directly using a Renderable
     * @param templates Key-value pairs that map to a template rendered in StringLiteral's
     */
    private renderByRenderable(templates?: SimpleObject): string {
        let render = '';
        let i = 0;
        for (const item of this.items) {
            const iteration = {
                [this.itemName]: item,
                [this.indexName]: i,
            };
            render += this.renderable.render(merge(iteration, templates));
            i++;
        }
        return render;
    }

    /**
     * Renders renderables using a function that generates the renderable.
     * @param templates Key-value pairs that map to a template rendered in StringLiteral's
     */
    private renderByFunction(templates?: SimpleObject): string {
        let render = '';
        let i = 0;
        for (const item of this.items) {
            let renderable = this.renderFunction(item, i, this.items);
            const iteration = {
                [this.itemName]: item,
                [this.indexName]: i,
            };

            if (isString(renderable)) {
                renderable = new StringLiteral(renderable);
            }

            render += renderable.render(merge(iteration, templates));
            i++;
        }
        return render;
    }

    /**
     * Check if the list of items is empty or not.
     */
    private isEmpty() {
        for (const _ of this.items) { // eslint-disable-line no-unused-vars
            return false;
        }

        return true;
    }
}

/**
H.each([1,2,3], H.div(' {{item}} ', H.each([3,4,5], '{{item}}')))
    -> "<div> 1 345 2 345 3 345</div>"

H.each([1,2,3], H.div(' {{outer}} ', H.each([3,4,5], '{{item}}:{{outer}}'))).setItemString('outer');
-> "<div> 1 1:31:41:5 2 2:32:42:5 3 3:33:43:5</div>"

 */
