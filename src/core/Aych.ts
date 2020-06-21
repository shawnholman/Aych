import {EmptyElement} from "../elements/EmptyElement";
import {NestableElement} from "../elements/NestableElement";
import {Piper} from "./Piper";
import {Renderable} from "./Renderable";
import {Attributes} from "../interfaces";
import {StringLiteral} from "./StringLiteral";

/**
 * The Aych class exposes all of the libraries features in an encapsulated package.
 */
export class Aych {
    [dynamicProperty: string]: (...args: any[]) => Renderable;

    /**
     * Defines a method on Aych that represents an element.
     * @param elType The type of element to create.
     * @param tagName The name of the tag that is used.
     */
    static create(elType: Aych.ElementType, tagName: string): void {
        if (elType == Aych.ElementType.Nested) {
            const element = function (tier1?: string | Renderable | Attributes, tier2?: string | Renderable | Attributes,  ...children: (Renderable|string)[]) {
                return new NestableElement(tagName, tier1, tier2, ...children);
            }
            Aych.define(tagName, element);
        } else if (elType == Aych.ElementType.Empty) {
            const element = function (tier1?: string | Attributes, tier2?: Attributes) {
                return new EmptyElement(tagName, tier1, tier2);
            }
            Aych.define(tagName, element);
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

    /**
     * Exported Piper
     */
    static Piper = Piper;

    /**
     * Defines a property on Aych's prototype.
     * @param name Name of the property.
     * @param value Value of the property.
     */
    private static define(name: string, value: any): void {
        Object.defineProperty(Aych.prototype, name, { value, configurable: true });
    }
}

export namespace Aych {
    export enum ElementType {
        Nested,
        Empty,
    }
}

Aych.create(Aych.ElementType.Nested, 'div');
/**

static renderer(name: string, renderer: (...args: any[]) => string) {
    Object.defineProperty(Renderable.prototype, name, {
        value: renderer,
        configurable: true
    });
}*/