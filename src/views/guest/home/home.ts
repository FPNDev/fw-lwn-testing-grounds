import { Component, In } from "fe-lwn";

@Component({
    selector: 'app-page-home',
    template: './home.html',
    styles: ['./home.scss']
})
export class HomePage {
    @In() params: any;
    a = 15;

    lcInit() {
    }

    doA() {
        alert(this.a++);
    }
}