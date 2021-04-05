let singletonMap = new Map();

export function singleton(singletonObjectOrClass: any, params: any[] = []) {
    const isConstructor = singletonObjectOrClass.name,
          singletonClass = isConstructor ? singletonObjectOrClass : singletonObjectOrClass.constructor,
          instance = isConstructor ? new singletonClass(...params) : singletonObjectOrClass;

    if (!singletonMap.has(singletonClass)) {
        singletonMap.set(singletonClass, instance);
        return instance;
    } else {
        return singletonMap.get(singletonClass);
    }
}

export default {
    singleton
};