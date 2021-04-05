import { Callable } from 'fe-lwn';

export const keys = (o: object) => Object.keys(o);
export const values = (o: object) => Object.values(o);
export const entries = (o: object) => Object.entries(o);

export const smart = (o: object) => {
    const newObj = Object.create(o);

    for (const fn of entries({keys, values, entries})) {
        Object.defineProperty(newObj, fn[0], {
            get() {
                return new class extends Callable {
                    _call(...args: any[]) {
                        return fn[1](o, ...args);
                    }
                    valueOf() {
                        return o[fn[0]];
                    }
                }
            },
            set(v: any) {
                o[fn[0]] = v;
            }
        })
    }

    return newObj;
};

export default {
    keys,
    values,
    entries,
    smart
};