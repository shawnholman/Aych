import {SimpleObject} from "./simple-object";

/** Rendering Operation */
export interface Renderable {
    /**
     * A render HTML string
     * @param templates
     */
    render(templates?: SimpleObject): string;
}
