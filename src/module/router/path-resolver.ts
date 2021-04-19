import { EventPipe, EventPipeSubscription } from "fe-lwn";
import { util } from "../util";
import { Route } from "./interface/route";

export class PathResolver {
    readonly pathOrderered$: EventPipe = new EventPipe();

    constructor() {
        this.modifyPathPipe();   
        this.pathOrderered$([]);
    }

    modifyPathPipe() {
        let storage: any;

        const subFn = this.pathOrderered$.subscribe;
        this.pathOrderered$.subscribe = (fn: any) => {
            const sub = subFn.bind(this.pathOrderered$)(fn);
            setTimeout(() => {
                if (storage !== undefined) {
                    sub._emit(storage);
                }
            });

            return sub;
        }
        

        subFn.bind(this.pathOrderered$)(ev => {
            storage = ev;
        });
    }

    async resolvePath(currentPath: string, routes: Route[]) {
        const currentRouteSub = this.pathOrderered$.subscribe(pathOrderered => {
            const currentRoute = pathOrderered[pathOrderered.length - 1];
            currentRouteSub.unsubscribe();

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

                return allRoutes.map(route => ({ ...route, guards: [...route.guards] }));
            }
            
            const pathUnordered = (indexRoutesAndFlatten(routes) as any);

            const isAsync = guardResult => guardResult instanceof Promise;

            for (const path of pathUnordered) {
                for (const idx in path.guards) {
                    path.guards[idx] = (new path.guards[idx]).canNavigate(currentRoute, path);
                }
            }

            const pathsGuardsResolution = pathUnordered.reduce((a, b) => 
                a.concat(
                    b.guards
                        .map((guardResult, idx) => ({
                            res: guardResult, 
                            path: b,
                            idx
                        }))
                        .filter(result => isAsync(result.res))
                    ), 
                []
            );
                
            Promise.all(pathsGuardsResolution.map(pathGuard => pathGuard.res))
                .then(resolutions => {

                    for (const idx in resolutions) {
                        pathsGuardsResolution[idx].path.guards[pathsGuardsResolution[idx].idx] = resolutions[idx];
                    }

                    const pathGuarded = pathUnordered.filter(path => {
                        return !path.guards?.length || 
                            path.guards.find(guardResult => !guardResult === false);
                    });

                    let max = pathGuarded[0];
                    for (const route of pathGuarded) {
                        if (
                            route.idx > max.idx || 
                            (route.idx === max.idx && !route.localPath.match(/^\/*$/))
                        ) {
                            max = route;
                        }
                    }

                    const maxIndex = pathUnordered.indexOf(max);
                    this.pathOrderered$.emit(max && max.localPath.match(/^\/*$/) ? pathUnordered.slice(maxIndex - max.idx, maxIndex + 1) : []);
                });
            
        });
    }
}