import { RoutePath } from "./route-path";

export interface Route {
    path: string;
    component?: { new(...args: any): any };
    children?: Route[];
    loadChildren?: Promise<Route[]>;
    redirectTo?: RoutePath;

    params?: { [_: string]: string };
} 