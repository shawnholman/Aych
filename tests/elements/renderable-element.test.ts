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
        let element = new MockRenderableElement('test').with({'test':'test'});
        let element2 = new MockRenderableElement('test').render({'test':'test'});

        expect(element.render()).to.equal(element2);
    });

    it('prioritizes templates from the render methods', () => {
        let element = new MockRenderableElement('test');
        let render = element.with({'test':'test', 'test2': 'test2'}).render({'test':'false'});

        expect(render).to.equal(JSON.stringify({'test':'false','test2':'test2'}));
    });

    it('prioritizes templates that are closest to the caller', () => {
        let element = new MockRenderableElement('test');
        let element2 = new MockRenderableElement('hey', element.with({'test':'tester'})).with({'test':'test2'});
        let render = element2.render();

        expect(render).to.equal('');
    });

    it('renders element using the each method', () => {
        let element = new MockRenderableElement('');

        expect(element.each([1,2,3]))
            .to.equal('{"item":1,"i":0}{"item":2,"i":1}{"item":3,"i":2}');

        expect(element.each([1,2,3], {additional: 'true'}))
            .to.equal('{"item":1,"i":0,"additional":"true"}{"item":2,"i":1,"additional":"true"}{"item":3,"i":2,"additional":"true"}');
    });

    it('renders element using the repeat method', () => {
        let element = new MockRenderableElement('');

        expect(element.repeat(3))
            .to.equal('{"item":0,"i":0}{"item":1,"i":1}{"item":2,"i":2}');

        expect(element.repeat(3, {additional: 'true'}))
            .to.equal('{"item":0,"i":0,"additional":"true"}{"item":1,"i":1,"additional":"true"}{"item":2,"i":2,"additional":"true"}');
    });

    it('renders element using the if method', () => {
        let element = new MockRenderableElement('').with({'test':'test'});

        expect(element.if(true))
            .to.equal('{"test":"test"}');

        expect(element.if(true, {additional: 'true'}))
            .to.equal('{"test":"test","additional":"true"}');

        expect(element.if(false))
            .to.equal('');
    });
});
