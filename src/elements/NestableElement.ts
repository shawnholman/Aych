import {SimpleObject} from "../interfaces";
import {RenderableElement} from "./RenderableElement";

export class NestableElement extends RenderableElement {
    /** @inheritdoc */
    internalRender(templates?: SimpleObject): string {
        const TAG = this.getTag();
        const attributes = this.getHtmlAttributeList();
        const children = this.renderChildren(templates);
        return `<${TAG}${attributes}>${children}</${TAG}>`;
    }
}
