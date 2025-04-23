export interface ObjectKeyString {
    [key: string]: string;
}
export interface ObjectKeyAny {
    [key: string]: any;
}
export type ObjectKeyGeneric<T = any> = {
    [key: string]: T;
};
