import { ChangeDetector, Component, Core, EventPipe, In, Out } from "fe-lwn";

@Component({
    selector: 'app-page-index',
    template: './index.html'
})
export class IndexPage {
    val: number = this.random();;
    $is: EventPipe;

    lcInit() {
        this.$is = new EventPipe()
        this.$is.subscribe(ev => this.setValFromIs(ev));
    }

    setValFromIs($ev) {
        this.val = $ev;
    }

    lcDestroy() {
        this.$is.close();
    }

    random() {
        return Math.random();
    }
}