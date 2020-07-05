/**
 * The SimpleObject interface is used to pass around data with a string key and basic
 * data types.
 */
export type SimpleObjectType = string | number | boolean | SimpleObject | null | undefined;
export interface SimpleObject {
    [key: string]: SimpleObjectType | Array<SimpleObjectType>;
}
