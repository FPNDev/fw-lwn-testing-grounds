import objects from "./objects";
import classes from "./classes";

export namespace util {
    export const keys = objOrArray => objects.keys(objOrArray);
    export const values = objOrArray => objects.values(objOrArray);
    export const entries = objOrArray => objects.entries(objOrArray);

    export const smart = objOrArray => objects.smart(objOrArray);

    export function singleton<T>(singletonObjectOrClass: T | { new(...args: any[]): T, [_: string]: any }, ...params: ConstructorParameters<(new (...args: any) => any) & T>): T {
        return classes.singleton(singletonObjectOrClass, params);
    }
}