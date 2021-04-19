import objects from "./objects";
import classes from "./classes";
import regexpAlias from "./regexp";
import pipes from "./pipes";
export namespace util {
    export const keys = objects.keys;
    export const values = objects.values;
    export const entries = objects.entries;

    export const smart = objects.smart;

    export const regexp = Object.freeze({
        escape(string) {
            return regexpAlias.escape(string);
        }
    })

    export function singleton<T>(singletonObjectOrClass: T | { new(...args: any[]): T, [_: string]: any }, ...params: ConstructorParameters<(new (...args: any) => any) & T>): T {
        return classes.singleton(singletonObjectOrClass, params);
    }

    export const pipeToPromise = pipes.pipeToPromise;
}