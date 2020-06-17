import { expect } from 'chai';
import {Element} from '../../src/elements';
import {SimpleObject} from "../../src/interfaces";

class MockElement extends Element {
    internalRender(templates?: SimpleObject): string {
        return '';
    }
}

class MockElement2 extends Element {
    internalRender(templates?: SimpleObject): string {
        return JSON.stringify(templates);
    }
}

describe('Element', () => {
    it('can be created with just a tag', () => {
        let element = new MockElement('div');

        expect(element.getTag()).to.equal('div');
        expect(element.getId()).to.not.exist;
        expect(element.getClassList()).to.be.empty;
    });

    it('gets created with an identifier (class only)', () => {
        let element = new MockElement('div', '.class1.class2.class3');

        expect(element.getId()).to.not.exist;
        expect(element.getClassList()).to.deep.equal(['class1', 'class2', 'class3']);
    });

    it('gets created with an identifier (id only)', () => {
        let element = new MockElement('div', '#id');

        expect(element.getId()).to.equal('id');
        expect(element.getClassList()).to.be.empty;
    });

    it('gets created with an identifier (both id and class)', () => {
        let element = new MockElement('div', '#id.class1.class2.class3');

        expect(element.getId()).to.equal('id');
        expect(element.getClassList()).to.deep.equal(['class1', 'class2', 'class3']);
    });

    it('invalid identifier gets create as string element', () => {
        let element = new MockElement('div', 'id.class1.class2.class3');

        expect(element.getId()).to.not.equal('id');
        expect(element.getClassList()).to.be.empty;
    });

    it('has an attribute when in tier1 position', () => {
        let element = new MockElement('div', {style:"width:100px;"});

        expect(element.getAttributes()).to.deep.equal({style:"width:100px;"});
    });

    it('has an attribute when in tier2 position with valid tier1 identifier string', () => {
        let element = new MockElement('div', '#id.class1.class2.class3', {style:"width:100px;"});

        expect(element.getId()).to.equal('id');
        expect(element.getClassList()).to.deep.equal(['class1', 'class2', 'class3']);
        expect(element.getAttributes()).to.deep.equal({style:"width:100px;"});
    });

    it('throws an error when multiple attributes are set', () => {
        expect(function () {
            new MockElement('div', {style:"width:100px;"}, {style:"width:100px;"});
        }).to.throw('Attributes field has been declared twice.');
    });

    it('can be set via setters', () => {
        let element = new MockElement('div');

        element.setId("id");
        expect(element.getId()).to.equal("id");

        element.setClassList(['class1', 'class2', 'class3']);
        expect(element.getClassList()).to.deep.equal(['class1', 'class2', 'class3']);

        element.setAttributes({style:"width:100px;"});
        expect(element.getAttributes()).to.deep.equal({style:"width:100px;"});

        element.setIdentifiers('#hello.col.col-xs');
        expect(element.getId()).to.equal("hello");
        expect(element.getClassList()).to.deep.equal(['col', 'col-xs']);

        // these setters should have no affect on the identifiers
        element.setIdentifiers('hello.col.col-xs');
        element.setIdentifiers('   ');
        element.setIdentifiers('.');

        expect(element.getId()).to.equal("hello");
        expect(element.getClassList()).to.deep.equal(['col', 'col-xs']);
    });

    it('renders element with templates set using the \'with\' tag', () => {
        let element = new MockElement2('test').with({'test':'test'});
        let element2 = new MockElement2('test').render({'test':'test'});

        expect(element.render()).to.equal(element2);
    });

    it('does not prioritize templates from the render methods by default', () => {
        let element = new MockElement2('test');
        let render = element.with({'test':'test', 'test2': 'test2'}).render({'test':'false'});

        expect(render).to.equal(JSON.stringify({'test':'test','test2':'test2'}));
    });

    it('prioritizes templates from the render methods when prioritizeRenderTemplates option is true', () => {
        let element = new MockElement2('test');
        let render = element.with({'test':'test', 'test2': 'test2'}).render({'test':'false'}, {
            prioritizeRenderTemplates: true,
        });

        expect(render).to.equal(JSON.stringify({'test':'false','test2':'test2'}));
    });

    /*it('renders element using the each method', () => {
        let element = new MockElement2('');

        expect(element.each([1,2,3]))
            .to.equal('{"item":1,"i":0}{"item":2,"i":1}{"item":3,"i":2}');

        expect(element.each([1,2,3], {additional: 'true'}))
            .to.equal('{"item":1,"i":0,"additional":"true"}{"item":2,"i":1,"additional":"true"}{"item":3,"i":2,"additional":"true"}');
    });

    it('renders element using the repeat method', () => {
        let element = new MockElement2('');

        expect(element.repeat(3))
            .to.equal('{"item":0,"i":0}{"item":1,"i":1}{"item":2,"i":2}');

        expect(element.repeat(3, {additional: 'true'}))
            .to.equal('{"item":0,"i":0,"additional":"true"}{"item":1,"i":1,"additional":"true"}{"item":2,"i":2,"additional":"true"}');
    });

    it('renders element using the if method', () => {
        let element = new MockElement2('').with({'test':'test'});

        expect(element.if(true))
            .to.equal('{"test":"test"}');

        expect(element.if(true, {additional: 'true'}))
            .to.equal('{"test":"test","additional":"true"}');

        expect(element.if(false))
            .to.equal('');
    });*/
});
