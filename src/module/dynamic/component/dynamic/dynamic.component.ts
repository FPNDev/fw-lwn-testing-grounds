import { Component, DOM, In } from "fe-lwn";
import { LWNMetadata, Core } from "fe-lwn";

@Component({
    selector: 'app-dynamic',
    template: './dynamic.component.html'
}) 
class DynamicComponent {
    @DOM.Self() private selfDOM: HTMLAnchorElement;
    @In() private is: any;

    @Core.Parent() private parent: any;

    lcChange({ is }) {
        if (is && is.new && this.selfDOM.isConnected) {
            const config = Reflect.getMetadata(LWNMetadata.ComponentConfig, is.new);
            if (config) {
                const dynamicComponent = document.createElement('div');
                const attributesComposed = this.selfDOM.getAttributeNames()
                    .map(attr => 
                        `${attr}="${this.selfDOM.getAttribute(attr)?.replace(/"/g, '\\"')}"`
                    ).join(' ');

                dynamicComponent.innerHTML = `
                    <${config.selector} ${attributesComposed}>
                        ${dynamicComponent.innerHTML}
                    </${config.selector}>
                `;

                this.selfDOM.parentElement.insertBefore(
                    dynamicComponent.firstElementChild,
                    this.selfDOM.nextSibling
                );

                Reflect.getMetadata('lwn:DirectiveParser', this.parent).parse(true);
            }

            this.selfDOM.remove();
        }
    }

}