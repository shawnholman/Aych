import {Attributes, Renderable, SimpleObject} from "./interfaces";
import {RenderableElement} from "./RenderableElement";

export class NestableElement extends RenderableElement {
    render(templates?: SimpleObject): string {
        const TAG = this.getTag();
        const attributes = this.getHtmlAttributeList();
        const children = this.renderChildren(templates);
        return `<${TAG}${this.getHtmlAttributeList()}>${children}</${TAG}>`;
    }
}
