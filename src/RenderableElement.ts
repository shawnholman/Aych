import {Renderable, SimpleObject} from "./interfaces";
import {Element} from "./Element";

export abstract class RenderableElement extends Element implements Renderable {
    abstract render(templates?: SimpleObject): string;

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
