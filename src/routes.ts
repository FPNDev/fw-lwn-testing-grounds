import { Route } from "./module/router";
import { HomePage } from "./views/guest/home/home";
import { IndexPage } from "./views/guest/index";

export const routes: Route[] = [
    {
        path: '',
        component: IndexPage
    },
    {
        path: 'blog/:id',
        component: HomePage
    }
    {
        path: 'home',
        component: HomePage
    }
]