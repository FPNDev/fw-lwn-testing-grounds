import { ChangeDetector, Component, EventPipeSubscription } from "fe-lwn";
import { Core } from "fe-lwn";

import '../../../dynamic';
import { Router } from "../../router";

@Component({
    selector: 'route-content',
    template: './route-content.component.html'
}) 
class RouteContentComponent {
    private static instances = [];
    private currentElement: { new(...args: any): any } = undefined;

    readonly router = Router.get();

    private $navigate: EventPipeSubscription;
    private $updateSub: EventPipeSubscription;

    private params: any

    @Core.ChangeDetector() private readonly changeDetector: ChangeDetector;

    lcInit() {
        RouteContentComponent.instances.push(this);
        this.runUpdate();

        this.$navigate = this.router.$navigate.subscribe(() => {
            this.runUpdate();
        });
    } 

    runUpdate() {
        this.$updateSub?.unsubscribe();

        this.$updateSub = this.router.getPathResolver()
            .pathOrderered$
            .subscribe(pathOrderered => {
                const navigationSorted = pathOrderered
                    .filter(route => route.component); 

                const currentConfig = navigationSorted[this.getIndex()];

                this.currentElement = currentConfig?.component;
                this.params = currentConfig?.params;

                if (this.currentElement) {
                    this.changeDetector.runUpdate(true);
                }
            });
    }

    getIndex() {
        return RouteContentComponent.instances.indexOf(this);
    }


    lcDestroy() {
        this.$navigate && this.$navigate.unsubscribe();
        RouteContentComponent.instances.splice(RouteContentComponent.instances.indexOf(this), 1);
    }
}