/** A simple object user to pass around data between a list of string key's and simple data types. */
export interface SimpleObject {
    [key: string]: string | number | boolean | Array<string | boolean | number | SimpleObject> | SimpleObject;
}
