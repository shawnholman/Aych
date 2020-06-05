import {Attributes, Renderable, SimpleObject} from "./interfaces";
import {RenderableElement} from "./RenderableElement";

export class EmptyElement extends RenderableElement {

    /** Empty elements gets constructed without children */
    constructor(tag: string, tier1?: string | Attributes, tier2?: Attributes) {
        super(tag, tier1, tier2);
    }


    render(templates?: SimpleObject): string {
        const TAG = this.getTag();
        return `<${TAG}${this.getHtmlAttributeList()} />`;
    }
}
