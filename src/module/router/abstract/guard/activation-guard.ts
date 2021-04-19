import { Route } from "../../interface/route";
import { RouteGuard } from "../../interface/route-guard";

export abstract class ActivationGuard implements RouteGuard {
    abstract canNavigate(currentRoute: Route, newRoute: Route): boolean | Promise<boolean>;
}