
import {Attributes, SimpleObject} from "./interfaces";
import {Renderable} from './core';

/**
 * Determines if parameter is a Renderable
 * @param param
 */
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
 * Determines if parameter is a Attributes based on the historic assumption that anything
 * not a string or renderable is an Attributes.
 * @param param
 */
export function isAttributes(param?: any): param is Attributes {
    return param !== undefined && (!isString(param) && !isRenderable(param));
}

/**
 * Merge two simple objects together
 * @param priority the priority object will not have any of its properties overriden
 * @param object priority will get merged into this object
 */
export function merge(priority?: SimpleObject, object?: SimpleObject) {
    return { ...object, ...priority };
}
