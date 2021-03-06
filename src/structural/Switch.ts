import {SimpleObject} from "../interfaces";
import {isString} from "../Util";
import {Renderable} from "../core/Renderable";
import {StringLiteral} from "../core/StringLiteral";

export type Switchable = string | number;
/**
 * The Switch class renders one out of one or more renderable based on the value of the switch.
 */
export class Switch<T extends Switchable> extends Renderable {
    private readonly value: T;
    private readonly cases: Switch.Case<T>[] = [];
    private defaultRenderable: Renderable;

    /**
     * Constructor
     * @param value The value determines which cases is chosen and rendered.
     * @param cases A set of cases with a value associated to it.
     * TODO: Take value as string for templates.
     */
    constructor(value: T, ...cases: Switch.Case<T>[]) {
        super();
        this.value = value;
        this.cases = cases;
    }

    /**
     * Sets the default renderable when no case is found.
     * @param toRender The default renderable if no case is found.
     */
    default(toRender: Renderable | string): Switch<T> {
        this.defaultRenderable = isString(toRender) ? new StringLiteral(toRender) : toRender;
        return this;
    }

    /** @inheritdoc */
    protected internalRender(templates: SimpleObject): string {
        const foundCase = this.cases.find((c) => c.hasValue(this.value));

        if (foundCase) {
            return foundCase.getRenderable().render(templates);
        } else {
            return this.defaultRenderable ? this.defaultRenderable.render(templates) : '';
        }
    }
}

/**
 * TODO: [p3] Nyc is reporting a missed branch here.
 * Further investigation needs to be done to restore 100% coverage.
 */
export namespace Switch {
    /**
     * The Case class works together with the switch class to provide
     * the different options based on the given value.
     */
    export class Case<T extends Switchable> {
        private readonly value: T;
        private readonly renderable: Renderable;

        /**
         * Constructor
         * @param value The value determines which cases is chosen and rendered.
         * @param renderable The renderable associated with this case.
         */
        constructor(value: T, toRender: Renderable | string) {
            this.value = value;
            this.renderable = isString(toRender) ? new StringLiteral(toRender) : toRender;
        }

        /** Gets the renderable */
        getRenderable(): Renderable {
            return this.renderable;
        }

        /**
         * Checks to see if the case matches some passed in value.
         * @param value The value to check for a match in the case.
         */
        hasValue(value: T): boolean {
            return this.value === value;
        }
    }
}
