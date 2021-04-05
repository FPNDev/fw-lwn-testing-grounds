import { Component } from "fe-lwn";

@Component({
    selector: 'app-page-home',
    template: './home.html'
})
export class HomePage {
    a = 15;

    doA() {
        alert(this.a++);
    }
}