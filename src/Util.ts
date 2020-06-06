/**
 * Determines if parameter is a Renderable
 * @param param
 */
import {Attributes, Renderable} from "./interfaces";

export function isRenderable(param?: any): param is Renderable {
    return param !== undefined && (param as Renderable).render !== undefined;
}

/**
 * Determines if parameter is a a string
 * @param param
 */
export function isString(param?: any): param is string {
    return param !== undefined && typeof param === 'string';
}

/**s
 * Determines if parameter is a Attributes
 * @param param
 */
export function isAttributes(param?: any): param is Attributes {
    return param !== undefined && (!isString(param) && !isRenderable(param));
}
