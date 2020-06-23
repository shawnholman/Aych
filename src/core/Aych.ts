import {EmptyElement} from "../elements/EmptyElement";
import {NestableElement} from "../elements/NestableElement";
import {Piper} from "./Piper";
import {Renderable} from "./Renderable";
import {Attributes} from "../interfaces";
import {StringLiteral} from "./StringLiteral";
import {Each, EachRenderFunction} from "../structural/Each";
import {Group} from "../structural/Group";
import {If} from "../structural/If";
import {Switch, Switchable} from "../structural/Switch";
import {isString} from "../Util";

/**
 * The Aych class exposes all of the libraries features in an encapsulated package.
 */
export class Aych {
    private static strictMode = true;

    static setStrictMode(mode: boolean) {
        Aych.strictMode = mode;
    }

    static isStrictMode() {
        return this.strictMode;
    }

    /**
     * Factory for creating element factories.
     * @param elType The type of element to create.
     * @param tagName The name of the tag that is used.
     */
    static create(elType: Aych.ElementType, tagName: string): void {
        if (elType == Aych.ElementType.NESTED) {
            // Create a nestable element factory on Aych
            const element = function (tier1?: string | Renderable | Attributes, tier2?: string | Renderable | Attributes,  ...children: (Renderable|string)[]) {
                let element = new NestableElement(tagName, tier1, tier2, ...children);

                /* TODO: [p2] Add the requiredAttrs
                if (Aych.isStrictMode()) {
                    let attrs = element.getAttributes();
                    requiredAttrs.forEach((item) => {
                        let missing = [];
                        if (!Object.prototype.hasOwnProperty.call(attrs, item)) {
                            missing.push(item);
                        }
                        if (missing.length) {
                            throw new Error(`Element (${tagName}) requires the following attributes: ${requiredAttrs}; But, could not find: ` + missing);
                        }
                    });
                }*/
                return element;
            };
            Aych.define(tagName, element, false);
        } else if (elType == Aych.ElementType.EMPTY) {
            // Create am empty element factory on Aych
            const element = function (tier1?: string | Attributes, tier2?: Attributes) {
                return new EmptyElement(tagName, tier1, tier2);
            };
            Aych.define(tagName, element, false);
        } else {
            throw new Error('ElementType does not exist: ' + elType);
        }
    }

    /**
     * Defines a method on Aych that when called returns back a Renderable. These are
     * known as composables.
     * @param name Name of the composable.
     * @param composition The method that the defines what arguments the composable takes
     * and which renderable it returns.
     */
    static compose(name: string, composition: (...args: any[]) => Renderable) {
        Aych.define(name, composition);
    }

    /**
     * Converts a javascript string literal into an Aych StringLiteral.
     * @param str The string literal to convert.
     */
    string(str: string): Renderable {
        return new StringLiteral(str);
    }

    /** @inheritDoc from Constructor of Each */
    each(items: Iterable<any>, renderable: EachRenderFunction | Renderable | string, indexName?: string, itemName?: string): Each {
        return new Each(items, renderable, indexName, itemName);
    }
    Each(items: Iterable<any>, renderable: EachRenderFunction | Renderable | string, indexName?: string, itemName?: string): Each {
        return new Each(items, renderable, indexName, itemName);
    }

    /** @inheritDoc from Constructor of Group */
    group (...members: (Renderable|string)[]): Group {
        return new Group(...members);
    }
    Group (...members: (Renderable|string)[]): Group {
        return new Group(...members);
    }

    /** @inheritDoc from Constructor of If */
    if (condition: boolean, ifRenderable: Renderable | string, elseRenderable?: Renderable | string): If {
        return new If(condition, ifRenderable, elseRenderable);
    }
    If (condition: boolean, ifRenderable: Renderable | string, elseRenderable?: Renderable | string): If {
        return new If(condition, ifRenderable, elseRenderable);
    }

    /** @inheritDoc from Constructor of Switch */
    switch (value: Switchable, ...cases: Switch.Case<Switchable>[]): Switch<Switchable> {
        if (isString(value)) {
            return new Switch(value as string, ...cases as Switch.Case<string>[]);
        } else {
            return new Switch(value as number, ...cases as Switch.Case<number>[]);
        }
    }
    Switch (value: Switchable, ...cases: Switch.Case<Switchable>[]): Switch<Switchable> {
        if (isString(value)) {
            return new Switch(value as string, ...cases as Switch.Case<string>[]);
        } else {
            return new Switch(value as number, ...cases as Switch.Case<number>[]);
        }
    }

    /** @inheritDoc from Constructor of Switch.Case */
    // @ts-ignore that the return type is not a renderable (an exception)
    case (value: Switchable, renderable: Renderable | string): Switch.Case<Switchable> {
        if (isString(value)) {
            return new Switch.Case(value as string, renderable);
        } else {
            return new Switch.Case(value as number, renderable);
        }
    }
    // @ts-ignore that the return type is not a renderable (an exception)
    Case (value: Switchable, renderable: Renderable | string): Switch.Case<Switchable> {
        if (isString(value)) {
            return new Switch.Case(value as string, renderable);
        } else {
            return new Switch.Case(value as number, renderable);
        }
    }

    /**
     * Exported Piper
     */
    static Piper = Piper;

    /**
     * Defines a property on Aych's prototype.
     * @param name Name of the property.
     * @param value Value of the property.
     */
    private static define(name: string, value: any, configurable = true): void {
        Object.defineProperty(Aych.prototype, name, { value, configurable });
    }

    [dynamicProperty: string]: (...args: any[]) => Renderable;
}

export namespace Aych {
    export enum ElementType {
        NESTED,
        EMPTY,
    }
}

Aych.create(Aych.ElementType.NESTED, 'div');