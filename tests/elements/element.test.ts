import { expect } from 'chai';
import { Element } from '../../src/elements';

class MockElement extends Element {}

describe('Element', () => {
    it('can be created with just a tag', () => {
        let element = new MockElement('div');

        expect(element.getTag()).to.equal('div');
        expect(element.getId()).to.not.exist;
        expect(element.getClassList()).to.be.empty;
        expect(element.getChildren()).to.be.empty;
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
        expect(element.getChildren()).to.have.lengthOf(1);
        expect(element.getChildren()[0].render()).to.equal('id.class1.class2.class3');
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

    it('throws an error when putting a child before attributes', () => {
        expect(function () {
            new MockElement('div', 'string', {style:"width:100px;"});
        }).to.throw('Attributes must come before children.');
    });

    it('throws an error when multiple attributes are set', () => {
        expect(function () {
            new MockElement('div', {style:"width:100px;"}, {style:"width:100px;"});
        }).to.throw('Attributes field has been declared twice.');
    });

    it('has an child when string tier2 position with valid tier1 identifier string', () => {
        let element = new MockElement('div', '#id.class1.class2.class3', 'this is a child');

        expect(element.getId()).to.equal('id');
        expect(element.getClassList()).to.deep.equal(['class1', 'class2', 'class3']);
        expect(element.getChildren()).to.have.lengthOf(1);
        expect(element.getChildren()[0].render()).to.equal('this is a child');
    });

    it('has valid identifier string, attributes, and all string children', () => {
        let element = new MockElement('div', '#id.class1.class2.class3', {style:"width:100px;"}, 'this is a child', 'this is a second child');

        expect(element.getId()).to.equal('id');
        expect(element.getClassList()).to.deep.equal(['class1', 'class2', 'class3']);
        expect(element.getAttributes()).to.deep.equal({style:"width:100px;"});
        expect(element.getChildren()).to.have.lengthOf(2);
        expect(element.getChildren()[0].render()).to.equal('this is a child');
        expect(element.getChildren()[1].render()).to.equal('this is a second child');
    });

    it('does not attempt to create an empty child.', () => {
        let element = new MockElement('div', '#id.class1.class2.class3', {style:"width:100px;"}, '');

        expect(element.getChildren()).to.have.lengthOf(0);
    });

    it('can be set via setters', () => {
        let element = new MockElement('div');

        element.setId("id");
        expect(element.getId()).to.equal("id");

        element.setClassList(['class1', 'class2', 'class3']);
        expect(element.getClassList()).to.deep.equal(['class1', 'class2', 'class3']);

        element.setAttributes({style:"width:100px;"});
        expect(element.getAttributes()).to.deep.equal({style:"width:100px;"});

        element.setChildren('this is a child', 'this is a second child');
        expect(element.getChildren()).to.have.lengthOf(2);
        expect(element.getChildren()[0].render()).to.equal('this is a child');
        expect(element.getChildren()[1].render()).to.equal('this is a second child');

        element.setIdentifiers('#hello.col.col-xs');
        expect(element.getId()).to.equal("hello");
        expect(element.getClassList()).to.deep.equal(['col', 'col-xs']);

        element.setIdentifiers('#hello.col.col-xs');
        expect(element.getId()).to.equal("hello");
        expect(element.getClassList()).to.deep.equal(['col', 'col-xs']);
    });

});
