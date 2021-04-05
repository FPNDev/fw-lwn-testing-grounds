import { RoutePath } from "../interface/route-path";

export namespace UtilPath {
    export function asString(route: RoutePath) {
        const routeStr = typeof route === 'string' ? asRouteGroup(route) : route;

        return '/' + routeStr?.filter(part => part).join('/') ?? '';
    }
    export function asRouteGroup(route: RoutePath) {
        const routeStr = typeof route !== 'string' ? asString(route) : route;
        
        return routeStr?.split('/').filter(part => part) ?? [''];
    }
}