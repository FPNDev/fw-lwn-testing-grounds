import { RouteGuard } from "./route-guard";
import { RoutePath } from "./route-path";

export interface Route {
    path: string;
    component?: { new(...args: any): any };
    children?: Route[];
    loadChildren?: Promise<Route[]>;
    redirectTo?: RoutePath;
    guards?: { new(): RouteGuard }[];

    params?: { [_: string]: string };
} 