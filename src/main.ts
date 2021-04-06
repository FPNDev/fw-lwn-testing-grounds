import { 
  Component, 
  group
} from "fe-lwn";
import { Router } from "./module/router";
import { UtilPath } from "./module/router/util/path";
import { util } from "./module/util";

import './module/dynamic';

// pages

import { IndexPage } from "./views/guest/index";
import { HomePage } from "./views/guest/home/home";
import { E404Page } from "./views/guest/error/404";

@Component({
  selector: 'app-main',
  template: './app.html',
  styles: ['./app.scss']
})
class AppComponent {
  router: Router = util.singleton(Router);
  routes: { [_: string]: any } = {
    '': IndexPage,
    'home': HomePage,
    '404': E404Page
  };

  get routeKeys() {
    return Object.keys(this.routes);
  }

  getPageComponent(path: string) {
    return this.routes[UtilPath.asString(path).slice(1)];
  }
 
  get404PageComponent() {
    return this.getPageComponent('404');
  }

  async lcInit() {
    this.registerEvents();
  }
  lcDestroy() {
    this.killEvents();
  }

  onIsEvent($e) {
    console.log($e);
  }

  getA() {
    return Math.random();
  }

  getRouteName() {
    return `Page name: ${this.routes.find(route => this.router.is(route))?.toUpperCase()}`;
  }

  registerEvents() {
    this.registerDummyEvent();
  }
  registerDummyEvent() {
    group([
      this.router.$navigate
    ]).subscribe(() => this['$dummyUpdate'] = Date.now());
  }

  killEvents() {
    group([
      this.router.$navigate
    ]).close();
  }
}
