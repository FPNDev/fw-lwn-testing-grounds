import { 
  Component, 
  group,
  Core,
  DirectiveParser
} from "fe-lwn";
import { Router } from "./module/router";
import { UtilPath } from "./module/router/util/path";
import { util } from "./module/util";

import './module/dynamic';

// pages

import { IndexPage } from "./views/guest/index";
import { HomePage } from "./views/guest/home/home";

@Component({
  selector: 'app-main',
  template: './app.html',
  styles: ['./app.scss']
})
class AppComponent {
  @Core.DirectiveParser() readonly directiveParser: DirectiveParser;

  router: Router = util.singleton(Router);
  routes: { [_: string]: any } = {
    '': IndexPage,
    'home': HomePage
  };

  get routeKeys() {
    return Object.keys(this.routes);
  }

  getPageComponent(path: string) {
    return this.routes[UtilPath.asString(path).slice(1)];
  }
 
  async lcInit() {
    this.registerEvents();
  }
  lcDestroy() {
    this.killEvents();
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