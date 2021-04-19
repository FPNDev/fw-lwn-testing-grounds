import { EventPipe } from "fe-lwn";
import { Route } from "./route";

export interface RouteGuard {
    canNavigate(route: Route, newRoute: any): Promise<boolean> | boolean;
}