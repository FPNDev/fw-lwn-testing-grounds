import { Bind, DOM, In } from "fe-lwn";
import { Router } from "../router";
import { UtilPath } from "../util/path";

@Bind({
    selector: ':route'
}) 
class RouteDirective {
    @DOM.Self() selfDOM: HTMLAnchorElement;
    @In() route: string | string[];

    private listeners = [];
    
    lcInit() {
        this.addListener('click', ev => {
            ev.preventDefault();
            
            Router.get().navigate(this.route);
        });
    }

    lcChange({ route }) {
        if (route) {
            this.selfDOM.href = UtilPath.asString(this.route);
        }
    }

    lcDestroy() {
        this.removeListeners();
    }

    addListener(...args: any[]) {
        this.selfDOM.addEventListener(args[0], args[1], args[2]);
        this.listeners.push(() => this.selfDOM.removeEventListener(args[0], args[1]));
    }
    removeListeners() {
        this.listeners.splice(0).map(removeListenerFn => removeListenerFn());
    }

}