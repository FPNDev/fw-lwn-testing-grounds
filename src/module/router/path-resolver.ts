import { util } from "../util";
import { Route } from "./interface/route";
import { Router } from "./router";

export class PathResolver {
    private pathOrderered: Route[] = [];

    constructor() {
        
    }

    resolvePath(currentPath: string, routes: Route[]) {
        let params = {};

        function indexRoutesAndFlatten(routes: Route[], idx = 0, localPath = currentPath, params = {}, parentComponent?: Route): Route[] {
            let allRoutes = [];
            
            for (const route of routes) {
                let match: RegExpMatchArray | boolean = !route.path.length;

                if (!match) {
                    let pathRegExp = util.regexp.escape(route.path).replace(/\:([\w_]+)/g, value => {
                        return `(?<${util.regexp.escape(value.substr(1))}>[^/]+)`;
                    });

                    const pathRegexp = new RegExp(`^\/(${pathRegExp})(?:/.*)?$`);
                    match = localPath.match(pathRegexp);
                }

                if (match) {
                    const isRouteEmpty = typeof match === 'boolean';

                    const newLocalPath = isRouteEmpty ? 
                        localPath : 
                        localPath.replace(match[1], '').replace(/^\/+$/, '');

                    const newParams = isRouteEmpty ? { ...params } : { ...params, ...((<RegExpMatchArray>match).groups || {}) };

                    allRoutes.push({
                        ...route,
                        idx,
                        localPath: newLocalPath,
                        parentComponent,
                        params: newParams
                    });

                    if (route.children) {
                        const childrenFlatten = indexRoutesAndFlatten(
                            route.children, 
                            idx + 1, 
                            newLocalPath,
                            newParams,
                            route
                        );

                        allRoutes.push(
                            ...childrenFlatten
                        );
                    }
                }
            }

            return allRoutes;
        }
        
        const pathUnordered = (indexRoutesAndFlatten(routes) as any);
        
        let max = pathUnordered[0];
        for (const route of pathUnordered) {
            if (
                route.idx > max.idx || 
                (route.idx === max.idx && !route.localPath.length)
            ) {
                max = route;
            }
        }

        const maxIndex = pathUnordered.indexOf(max);
        this.pathOrderered = max && !max.localPath.length ? pathUnordered.slice(maxIndex - max.idx, maxIndex + 1) : [];

    }

    getRoutesOrdered(): Route[] {
        return this.pathOrderered;
    }
}