import {SimpleObject} from "./simple-object";

/** Rendering Operation */
export interface Renderable {
    /**
     * Converts data into its string representation.
     * @param templates the data to inject into the string
     */
    render(templates?: SimpleObject): string;

    /**
     * Repeats the renderable based on the elements of an iterable.
     * Two templates should be inject during each iteration:
     *      i: the index
     *      item: the value of the current item at i
     * @param items the elements to iterate through
     * @param templates additional data to inject into each iteration
     */
    each(items: Iterable<any>, templates?: SimpleObject): string;

    /**
     * Repeats the renderable x number of times.
     * Two templates should be inject during each iteration:
     *      i: the index
     *      item: the value of the current item at i
     * @param x the number of times to repeat
     * @param templates additional data to inject into each iteration
     */
    repeat(x: number, templates?: SimpleObject): string;

    /**
     * Renders the renderable based on a condition.
     * @param condition determines whether or not to render the renderable.
     * @param templates the data to inject into the string
     */
    when(condition: boolean, templates?: SimpleObject): string;
}
