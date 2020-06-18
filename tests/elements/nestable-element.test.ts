import { expect } from 'chai';
import {NestableElement} from "../../src/elements";

describe('NestableElement', () => {
    it('renders an empty div element without attributes', () => {
        const element = new NestableElement('div');
        const rendered = element.render();
        expect(rendered).to.equal('<div></div>');
    });

    it('renders an empty div element with an id', () => {
        const element = new NestableElement('div', '#image');
        const rendered = element.render();
        expect(rendered).to.equal('<div id="image"></div>');
    });

    it('renders an empty div element with an class', () => {
        const element = new NestableElement('div', '.image');
        const rendered = element.render();
        expect(rendered).to.equal('<div class="image"></div>');
    });

    it('renders an empty div element with an id and class', () => {
        const element = new NestableElement('div', '#image.image');
        const rendered = element.render();
        expect(rendered).to.equal('<div id="image" class="image"></div>');
    });

    it('renders an empty div element with attributes', () => {
        const element = new NestableElement('div', { style: "width: 100px;" });
        const rendered = element.render();
        expect(rendered).to.equal('<div style="width: 100px;"></div>');
    });

    it('throws an error when trying to use attributes in tier1 and tier2', () => {
        expect(function () {
            new NestableElement('div', { style: "width: 100px;" }, { style: "width: 100px;" });
        }).to.throw('Attributes field has been declared twice.');
    });

    it('throws an error when using a child before the attribute', () => {
        expect(function () {
            new NestableElement('div', 'I\'m a child', { style: "width: 100px;" });
        }).to.throw('Attributes must come before children.');
    });

    it('renders an empty div element with attributes and id', () => {
        const element = new NestableElement('div', '#image', { style: "width: 100px;" });
        const rendered = element.render();
        expect(rendered).to.equal('<div id="image" style="width: 100px;"></div>');
    });

    it('renders an empty div element with attributes and class', () => {
        const element = new NestableElement('div', '.image', { style: "width: 100px;" });
        const rendered = element.render();
        expect(rendered).to.equal('<div class="image" style="width: 100px;"></div>');
    });

    it('renders an empty element with attributes, id and class', () => {
        const element = new NestableElement('div', '#image.image', { style: "width: 100px;" });
        const rendered = element.render();
        expect(rendered).to.equal('<div id="image" class="image" style="width: 100px;"></div>');
    });

    it('renders an empty element without attributes', () => {
        const element = new NestableElement('div');
        const rendered = element.render();
        expect(rendered).to.equal('<div></div>');
    });

    it('renders an empty element without attributes ignoring empty string', () => {
        // The tier1 is an empty string which should be ignored by NestableElement but still considered
        // a child. When addChild is called with this empty string, no child actually gets added.
        const element = new NestableElement('div', '');
        const rendered = element.render();
        expect(rendered).to.equal('<div></div>');
        expect(element.getChildren()).to.have.lengthOf(0);
    });

    it('renders an empty div nested inside of an empty div', () => {
        const element = new NestableElement('div', new NestableElement('div'));
        const rendered = element.render();
        expect(rendered).to.equal('<div><div></div></div>');
        expect(element.getChildren()).to.have.lengthOf(1);
    });

    it('renders a div with 5 empty div children', () => {
        const element = new NestableElement('div',
            new NestableElement('div'),
            new NestableElement('div'),
            new NestableElement('div'),
            new NestableElement('div'),
            new NestableElement('div')
        );
        const rendered = element.render();
        expect(rendered).to.equal('<div><div></div><div></div><div></div><div></div><div></div></div>');
    });

    it('renders a div (with id and class) with 5 empty div children', () => {
        const element = new NestableElement('div', '#hi.class1',
            new NestableElement('div'),
            new NestableElement('div'),
            new NestableElement('div'),
            new NestableElement('div'),
            new NestableElement('div')
        );
        const rendered = element.render();
        expect(rendered).to.equal('<div id="hi" class="class1"><div></div><div></div><div></div><div></div><div></div></div>');
    });

    it('renders a div (with id, class, and attributes) with 5 empty div children', () => {
        const element = new NestableElement('div', '#hi.class1', { style: "width: 100px;" },
            new NestableElement('div'),
            new NestableElement('div'),
            new NestableElement('div'),
            new NestableElement('div'),
            new NestableElement('div')
        );
        const rendered = element.render();
        expect(rendered).to.equal('<div id="hi" class="class1" style="width: 100px;"><div></div><div></div><div></div><div></div><div></div></div>');
    });

    it('renders a div (with id, class, and attributes) with four div\'s nested inside.', () => {
        const element = new NestableElement('div', '#hi.class1', { style: "width: 100px;" },
            new NestableElement('div',
                new NestableElement('div',
                    new NestableElement('div',
                        new NestableElement('div')
                    )
                )
            )
        );
        const rendered = element.render();
        expect(rendered).to.equal('<div id="hi" class="class1" style="width: 100px;"><div><div><div><div></div></div></div></div></div>');
    });

    /**
     *
     it('prioritizes templates that are closest to the caller', () => {
        let element = new MockElement2('test');
        let element2 = new MockElement2('hey', element.with({'test':'tester'})).with({'test':'test2'});
        let render = element2.render();

        expect(render).to.equal('');
    });
     */
});
