import './directive/route.directive';

import { RoutePath } from './interface/route-path';
import { UtilPath } from './util/path';

import { EventPipe } from "fe-lwn";
import { util } from '../util';

export class Router {
    readonly $navigate = new EventPipe<RoutePath>();

    static get() {
        return util.singleton(Router);
    }

    constructor() {
        return util.singleton<Router>(this);
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
        this.afterNavigate();
    }

    afterNavigate() {
        this.$navigate(UtilPath.asRouteGroup(this.getCurrentPath()));
    }

    getCurrentPath() { 
        return location.pathname;
    }
} 

window.onpopstate = () => {
    Router.get().afterNavigate();
}