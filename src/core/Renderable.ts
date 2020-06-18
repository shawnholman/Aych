import {RenderOptions, SimpleObject} from "../interfaces";
import {merge} from "../Util";

export abstract class Renderable {
    protected templates: SimpleObject = {};

    /**
     * Sets the templates to use during rendering
     * @param templates
     */
    with(templates: SimpleObject): Renderable {
        this.templates = templates;
        return this;
    }

    /**
     * Append the templates to the current ones
     */
    append(templates: SimpleObject, prioritize = false): Renderable {
        this.templates = prioritize ? merge(templates, this.templates) : merge(this.templates, templates);
        return this;
    }

    /** @inheritdoc */
    render(templates?: SimpleObject, options?: RenderOptions): string {
        if (options?.prioritizeRenderTemplates) {
            return this.internalRender(merge(templates, this.templates));
        }
        return this.internalRender(merge(this.templates, templates));
    }

    /** @inheritdoc */
    /*each(items: Iterable<any>, templates?: SimpleObject): string {
        return new Each(items, this).render(templates);
    }*/

    /** @inheritdoc */
    /*repeat(x: number, templates?: SimpleObject): string {
        return new Each([...Array(x).keys()], this).render(templates);
    }*/

    /** @inheritdoc */
    /*if(condition: boolean, templates?: SimpleObject): string {
        return new If(condition, this).render(templates);
    }*/

    /**
     * The internal render functions is used to tell the RenderableElement class how
     * the particular element is rendered.
     * @param templates
     */
    protected abstract internalRender(templates: SimpleObject): string;
}
