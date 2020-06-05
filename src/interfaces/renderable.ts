import {SimpleObject} from "./simple-object";

/** Rendering Operation */
export interface Renderable {
    /**
     *
     * @param templates
     */
    render(templates?: SimpleObject): string;
}
