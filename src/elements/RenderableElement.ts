import {Renderable, SimpleObject} from "../interfaces";
import {Element} from "./Element";

export abstract class RenderableElement extends Element implements Renderable {
    protected templates: SimpleObject;

    render(templates?: SimpleObject): string {
        return this.internalRender(templates || this.templates);
    }

    /**
     * The internal render functions is used to tell the RenderableElement class how
     * the particular element is rendered.
     * @param templates
     */
    abstract internalRender(templates?: SimpleObject): string;

    /**
     * Sets the templates to use during rendering
     * @param templates
     */
    with(templates: SimpleObject): Renderable {
        this.templates = templates;
        return this;
    }

    // ---------------------- INTERNAL API ----------------------

    /** Given an object of attributes, converts attributes into the HTML equivalent list. */
    protected getHtmlAttributeList(): string {
        const attributesEntries = Object.entries(this.getAttributes());

        if (this.getClassList().length > 0) {
            const classString = this.getClassList().join(" ");
            attributesEntries.unshift(['class', classString]);
        }
        if (this.getId()) {
            attributesEntries.unshift(['id', this.getId()]);
        }
        return attributesEntries.reduce((str, [name, value]) => {
            return str + ` ${name}="${value}"`;
        }, '');
    }

    /** Builds the inside of the element */
    protected renderChildren(templates?: SimpleObject): string {
        return this.getChildren().reduce((current, next) => {
            return current + next.render(templates);
        }, '');
    }
}
