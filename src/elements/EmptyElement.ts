import {SimpleObject} from "../interfaces";
import {Element} from "./Element";

export class EmptyElement extends Element {
    /** @inheritdoc */
    protected internalRender(templates?: SimpleObject): string {
        const tag = this.getTag();
        const attributeList = this.getHtmlAttributeList();
        return `<${tag}${attributeList}>`;
    }
}
