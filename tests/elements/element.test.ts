import {expect} from 'chai';
import {Element} from '../../src/elements/Element';
import {SimpleObject} from "../../src/interfaces/simple-object";

class MockElement extends Element {
    internalRender(templates?: SimpleObject): string {
        return '';
    }

    getAttributeRender() {
        return this.getHtmlAttributeList().trim();
    }
}

describe('Element', () => {
    it('can be created with just a tag', () => {
        const element = new MockElement('div');
        expect(element.getTag()).to.equal('div');
        expect(element.getId()).to.not.exist;
        expect(element.getClassList()).to.be.empty;
        expect(element.getAttributeRender()).to.equal('');

        // Makes sure that tags are being lower cased
        const element2 = new MockElement('DIV');
        expect(element2.getTag()).to.equal('div');
    });

    it('gets created with an identifier (class only)', () => {
        const element = new MockElement('div', '.class1.class2.class3');

        expect(element.getId()).to.not.exist;
        expect(element.getClassList()).to.deep.equal(['class1', 'class2', 'class3']);
        expect(element.getAttributeRender()).to.equal('class="class1 class2 class3"');
    });

    it('gets created with an identifier (id only)', () => {
        const element = new MockElement('div', '#id');

        expect(element.getId()).to.equal('id');
        expect(element.getClassList()).to.be.empty;
    });

    it('gets created with an identifier (both id and class)', () => {
        const element = new MockElement('div', '#id.class1.class2.class3');

        expect(element.getId()).to.equal('id');
        expect(element.getClassList()).to.deep.equal(['class1', 'class2', 'class3']);
    });

    it('invalid identifier gets create as string element', () => {
        const element = new MockElement('div', 'id.class1.class2.class3');

        expect(element.getId()).to.not.equal('id');
        expect(element.getClassList()).to.be.empty;
    });

    it('selects attributes based on conditions', () => {
        const element = new MockElement('div', {
            id: [false, 'id'],
            'data-example': [true, 'example'],
            class: [true, 'class1', 'class2'],
            style: [false, "width:100px;", "width:150px;"]
        });

        expect(element.getAttributeRender()).to.equal('data-example="example" class="class1" style="width:150px;"');
    });

    it('has an attribute when in tier1 position', () => {
        const element = new MockElement('div', {style:"width:100px;"});

        expect(element.getAttributes()).to.deep.equal({style:"width:100px;"});
    });

    it('has an attribute when in tier2 position with valid tier1 identifier string', () => {
        const element = new MockElement('div', '#id.class1.class2.class3', {style:"width:100px;",hidden:null});

        expect(element.getId()).to.equal('id');
        expect(element.getClassList()).to.deep.equal(['class1', 'class2', 'class3']);
        expect(element.getAttributes()).to.deep.equal({class: "class1 class2 class3", id: "id", style:"width:100px;",hidden:null});
    });

    it('throws an error when multiple attributes are set', () => {
        expect(function () {
            new MockElement('div', {style:"width:100px;"}, {style:"width:100px;"});
        }).to.throw('Attributes field has been declared twice.');
    });

    it('can be set via setters', () => {
        const element = new MockElement('div');

        element.setId("id");
        expect(element.getId()).to.equal("id");
        expect(element.getAttributeRender()).to.equal('id="id"');

        element.setClassList(['class1', 'class2', 'class3']);
        expect(element.getClassList()).to.deep.equal(['class1', 'class2', 'class3']);
        expect(element.getAttributeRender()).to.equal('id="id" class="class1 class2 class3"');

        element.setAttributes({style:"width:100px;",hidden:null,lang:"en"});
        expect(element.getAttributes()).to.deep.equal({class: "class1 class2 class3", id: "id", style:"width:100px;",hidden:null,lang:"en"});
        expect(element.getAttributeRender()).to.equal('id="id" class="class1 class2 class3" style="width:100px;" hidden lang="en"');


        element.setIdentifiers('#hello.col.col-xs');
        expect(element.getId()).to.equal("hello");
        expect(element.getClassList()).to.deep.equal(['col', 'col-xs']);
        expect(element.getAttributeRender()).to.equal('id="hello" class="col col-xs" style="width:100px;" hidden lang="en"');


        // these setters should have no affect on the identifiers
        element.setIdentifiers('hello.col.col-xs');
        element.setIdentifiers('   ');
        element.setIdentifiers('.');

        expect(element.getId()).to.equal("hello");
        expect(element.getClassList()).to.deep.equal(['col', 'col-xs']);
        expect(element.getAttributeRender()).to.equal('id="hello" class="col col-xs" style="width:100px;" hidden lang="en"');
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
