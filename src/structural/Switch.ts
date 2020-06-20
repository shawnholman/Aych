import {SimpleObject} from "../interfaces";
import {isString} from "../Util";
import {Renderable, StringLiteral} from "../core";

type Switchable = string | number;
/**
 * The Switch class renders one out of one or more renderable based on the value of the switch.
 */
export class Switch<T extends Switchable> extends Renderable {
    private readonly value: T;
    private readonly cases: Switch.Case<T>[] = [];
    private defaultElement: Renderable;

    /**
     * Constructor
     * @param value The value determines which cases is chosen and rendered.
     * @param cases A set of cases with a value associated to it.
     */
    constructor(value: T, ...cases: Switch.Case<T>[]) {
        super();
        this.value = value;
        this.cases = cases;
    }

    /**
     * Sets the default element when no case is found.
     * @param element The element to set to.
     */
    default(element: Renderable | string): Renderable {
        this.defaultElement = isString(element) ? new StringLiteral(element) : element;
        return this;
    }

    /** @inheritdoc */
    protected internalRender(templates: SimpleObject): string {
        const foundCase = this.cases.find((c) => c.hasValue(this.value));

        if (foundCase) {
            return foundCase.getElement().render(templates);
        } else {
            return this.defaultElement ? this.defaultElement.render(templates) : '';
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
        private readonly element: Renderable;

        /**
         * Constructor
         * @param value The value determines which cases is chosen and rendered.
         * @param element The element associated with this case.
         */
        constructor(value: T, element: Renderable | string) {
            this.value = value;
            this.element = isString(element) ? new StringLiteral(element) : element;
        }

        /** Gets the element */
        getElement(): Renderable {
            return this.element;
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
