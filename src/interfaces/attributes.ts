/**
 * The Attributes interface represents the whole set of possible HTML attributes.
 *
 * TODO: [p2] Add the list of possible HTML attributes here
 */
export type Attribute = string | null | Array<boolean | string | null>;
export interface Attributes {
    [key: string]: Attribute;
}
