import { Route } from "../../interface/route";
import { RouteGuard } from "../../interface/route-guard";

export abstract class DeactivationGuard implements RouteGuard {
    abstract canNavigate(currentRoute: Route, newRoute: Route): boolean | Promise<boolean>;
}