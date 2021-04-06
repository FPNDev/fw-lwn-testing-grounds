import { Component, EventPipe, In, Out } from "fe-lwn";

@Component({
    selector: 'app-page-index',
    template: './index.html'
})
export class IndexPage {
    @Out() val = 0;
    @Out() $is = new EventPipe();

    private _interval: any;

    lcInit() {
        this.$is.subscribe(this.setValFromIs);

        this._interval = setInterval(() => {
            this.$is(this.val++);
        }, 1000);
    }

    setValFromIs($ev) {
        this.val = $ev;
    }

    lcDestroy() {
        this.is.close();
        clearInterval(this._interval);
    }
}