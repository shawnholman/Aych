import {RenderOptions} from "../interfaces";
import {SimpleObject} from "../interfaces";
import {merge} from "../Util";

/**
 * The Renderable class is part of the most basic unit of Aych. This abstract class provides
 * foundational logic for renderable child class to inherit and use. A renderable, conceptually,
 * is a class that has a render method that can be called to get a string representation of that
 * class.
 */
export abstract class Renderable {
    protected templates: SimpleObject = {};
    private canRender = true;

    /**
     * Sets the templates.
     * @param templates Key-value pairs that map to a template rendered in StringLiteral's
     */
    with(templates: SimpleObject): Renderable {
        this.templates = templates;
        return this;
    }

    /**
     * Turn on and off the ability for this element to render
     * @param condition The condition that determines whether or not the element can render.
     */
    when(condition: boolean): Renderable {
        this.canRender = condition;
        return this;
    }

    /**
     * Appends templates to the existing templates object.
     * @param templates Key-value pairs that map to a template rendered in StringLiteral's
     * @param prioritize Whether or not to allow appended templates to override existing template properties
     */
    append(templates: SimpleObject, prioritize = false): Renderable {
        this.templates = prioritize ? merge(templates, this.templates) : merge(this.templates, templates);
        return this;
    }

    /**
     * Renders the internalRender function.
     * @param templates Templates to pass in
     * @param options Render options
     */
    render(templates?: SimpleObject, options?: RenderOptions): string {
        if (options?.prioritizeRenderTemplates) {
            return this.canRender ? this.internalRender(merge(templates, this.templates)) : '';
        }
        return this.canRender ? this.internalRender(merge(this.templates, templates)) : '';
    }

    /**
     * Getting for the HTML returned by the render function.
     */
    get r(): string {
        return this.render();
    }

    /**
     * Overrides the toString method called by JavaScript when
     * string concatenate occurs
     */
    public toString = () : string => {
        return this.render();
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
     * The internal render functions is used to define how a subclass renders itself.
     * @param templates Key-value pairs that map to a template rendered in StringLiteral's
     */
    protected abstract internalRender(templates: SimpleObject): string;
}
