import {SimpleObject} from "../interfaces";
import {Element} from "./Element";

/**
 * The EmptyElement class represents elements that do not have a closing tag.
 */
export class EmptyElement extends Element {
    /** @inheritdoc */
    protected internalRender(templates: SimpleObject): string {
        const tag = this.getTag();
        const attributeList = this.getHtmlAttributeList(templates);
        return `<${tag}${attributeList}>`;
    }
}
