/**
 * The SimpleObject interface is used to pass around data with a string key and basic
 * data types.
 */
export interface SimpleObject {
    [key: string]: string | number | boolean | Array<string | boolean | number | SimpleObject> | SimpleObject;
}
