import { Route, ActivationGuard } from "../../module/router";

export class AuthGuard extends ActivationGuard {
    canNavigate(route: Route, newRoute: Route): Promise<boolean> {
        return new Promise(resolve => {
            setTimeout(() => {
                return resolve(true);
            }, 3000);
        })
    }
}