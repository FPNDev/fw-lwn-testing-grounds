import { Component, DOM, In } from "fe-lwn";
import { LWNMetadata, DirectiveParser, Core } from "fe-lwn";

@Component({
    selector: 'app-dynamic',
    template: './dynamic.component.html'
}) 
class DynamicComponent {
    @DOM.Self() selfDOM: HTMLAnchorElement;
    @In() is: any;

    @Core.Parent() parent: { directiveParser: DirectiveParser };

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

                this.parent.directiveParser.parse(true);
            }

            this.selfDOM.remove();
        }
    }

}