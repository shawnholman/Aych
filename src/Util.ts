import {Attributes, SimpleObject} from "./interfaces";
import {Renderable} from './core/Renderable';

/**
 * Determines if parameter is a Renderable.
 * @param param
 */
export function isRenderable(param?: any): param is Renderable {
    return param !== undefined && (param as Renderable).render !== undefined;
}

/**
 * Determines if parameter is a a string.
 * @param param
 */
export function isString(param?: any): param is string {
    return param !== undefined && typeof param === 'string';
}

/**s
 * Determines if parameter is a Attributes based on the historic assumption that anything
 * not a string or renderable is an Attributes.
 * @param param
 */
export function isAttributes(param?: any): param is Attributes {
    return param !== undefined && (!isString(param) && !isRenderable(param));
}

/**
 * Merges two simple objects together.
 * @param priority The priority object will not have any of its properties overriden.
 * @param object Priority will get merged into this object.
 */
export function merge(priority?: SimpleObject, object?: SimpleObject) {
    return { ...object, ...priority };
}

/**
 * Converts kebab case into camel case.
 * @param str String to convert.
 */
export function kebabToCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Removes unnecessary spaces and new lines from a string.
 * @param str The string to remove spaces from.
 */
export function removeSpaces(str: string): string {
    return str.split('\n').map((line) => line.trim()).join('');
}