import { Route } from "./module/router";
import { AuthGuard } from "./shared/guard/auth.guard";
import { HomePage } from "./view/page/guest/home/home";
import { IndexPage } from "./view/page/guest/index/index";

export const routes: Route[] = [
    {
        path: '',
        component: IndexPage,
        guards: [AuthGuard]
    },
    {
        path: '',
        component: HomePage,
        guards: []
    },
]