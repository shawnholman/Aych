import { expect } from 'chai';
import { RenderableElement } from '../../src/elements';
import {SimpleObject} from "../../src/interfaces";

class MockRenderableElement extends RenderableElement {
    internalRender(templates?: SimpleObject): string {
        return JSON.stringify(templates);
    }
}

describe('RenderableElement', () => {
    it('renders element with templates set using the \'with\' tag', () => {
        let element = new MockRenderableElement('test');
        let element2 = new MockRenderableElement('test');
        expect(element.with({'test':'test'}).render())
            .equal(element.render({'test':'test'}));
    });
});
