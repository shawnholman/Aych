import {expect} from "chai";
import {SimpleObject} from "../../src/interfaces";
import {Renderable} from "../../src/core";

class MockRenderable extends Renderable {
    internalRender(templates?: SimpleObject): string {
        return JSON.stringify(templates);
    }
}

describe('Renderable', () => {
    it ('renders a basic element', () => {
       const element = new MockRenderable();
       const render = element.render();

       expect(render).to.equal('{}');
    });

    it ('renders element with templates set using the \'append\' method', () => {
        const element = new MockRenderable().append({'test': 'test'}).append({'test2': 'test2'});
        // Non-prioritized, the append method adds to the front of the current templates as not to override
        // any current properties. It's properties can be override, though.
        const element2 = new MockRenderable().render({'test2': 'test2', 'test': 'test'});

        expect(element.render()).to.equal(element2);
    });

    it ('renders element with templates set using the \'append\' method prioritized', () => {
        const element = new MockRenderable().append({'test': 'test'}).append({'test2': 'test2'}, true);
        const element2 = new MockRenderable().render({'test': 'test', 'test2': 'test2'});

        expect(element.render()).to.equal(element2);
    });

    it('renders element with templates set using the \'with\' method', () => {
        const element = new MockRenderable().with({'test': 'test'});
        const element2 = new MockRenderable().render({'test': 'test'});

        expect(element.render()).to.equal(element2);
    });

    it('does not prioritize templates from the render methods by default', () => {
        const element = new MockRenderable();
        const render = element.with({'test': 'test', 'test2': 'test2'}).render({'test': 'false'});

        expect(render).to.equal(JSON.stringify({'test': 'test', 'test2': 'test2'}));
    });

    it('prioritizes templates from the render methods when prioritizeRenderTemplates option is true', () => {
        const element = new MockRenderable();
        const render = element.with({'test': 'test', 'test2': 'test2'}).render({'test': 'false'}, {
            prioritizeRenderTemplates: true,
        });

        expect(render).to.equal(JSON.stringify({'test': 'false', 'test2': 'test2'}));
    });
})
