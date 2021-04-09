import './directive/route.directive';

import { RoutePath } from './interface/route-path';
import { UtilPath } from './util/path';

import { EventPipe } from "fe-lwn";
import { util } from '../util';
import { Route } from './interface/route';
import { PathResolver } from './path-resolver';

export class Router {
    readonly $navigate = new EventPipe<RoutePath>();
    private routes: Route[] = [];

    private readonly pathResolver = new PathResolver();

    static get() {
        return util.singleton(Router);
    }

    constructor() {
        const singleton = util.singleton<Router>(this);

        if (singleton === this) {      
            this.navigationOccured();
        }

        return singleton;
    }

    getPathResolver() {
        return this.pathResolver;
    }

    is(route: RoutePath, matchParts?: number) {
        if (matchParts === undefined) {
            return UtilPath.asString(route) === this.getCurrentPath();
        } else {
            return UtilPath.asString(UtilPath.asRouteGroup(route).slice(0, matchParts)) 
                === UtilPath.asString(UtilPath.asRouteGroup(this.getCurrentPath()).splice(0, matchParts));
        }
    }
    navigate(route: RoutePath) {
        history.pushState(null, null, UtilPath.asString(route));        
        this.navigationOccured();
    }

    navigationOccured() {
        this.pathResolver.resolvePath(this.getCurrentPath(), this.routes);
        this.$navigate(UtilPath.asRouteGroup(this.getCurrentPath()));
    }

    getCurrentPath() { 
        return location.pathname;
    }

    registerRoutes(routes: Route[]) {
        this.routes = routes;
        this.navigationOccured();
    }

    getRoutes() {
        return this.routes;
    }
} 

window.onpopstate = () => {
    Router.get().navigationOccured();
}