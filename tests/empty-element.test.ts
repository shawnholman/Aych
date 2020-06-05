import { expect } from 'chai';
import {EmptyElement} from "../src/EmptyElement";

describe('EmptyElement', () => {
    it('renders an empty element without attributes', () => {
        const element = new EmptyElement('img');
        const rendered = element.render();
        expect(rendered).to.equal('<img>');
    });

    it('renders an empty element with an id', () => {
        const element = new EmptyElement('img', '#image');
        const rendered = element.render();
        expect(rendered).to.equal('<img id="image">');
    });

    it('renders an empty element with an class', () => {
        const element = new EmptyElement('img', '.image');
        const rendered = element.render();
        expect(rendered).to.equal('<img class="image">');
    });

    it('renders an empty element with an id and class', () => {
        const element = new EmptyElement('img', '#image.image');
        const rendered = element.render();
        expect(rendered).to.equal('<img id="image" class="image">');
    });

    it('renders an empty element with attributes', () => {
        const element = new EmptyElement('img', { src: "img/img.png" });
        const rendered = element.render();
        expect(rendered).to.equal('<img src="img/img.png">');
    });

    it('renders an empty element with attributes and id', () => {
        const element = new EmptyElement('img', '#image', { src: "img/img.png" });
        const rendered = element.render();
        expect(rendered).to.equal('<img id="image" src="img/img.png">');
    });

    it('renders an empty element with attributes and class', () => {
        const element = new EmptyElement('img', '.image', { src: "img/img.png" });
        const rendered = element.render();
        expect(rendered).to.equal('<img class="image" src="img/img.png">');
    });

    it('renders an empty element with attributes, id and class', () => {
        const element = new EmptyElement('img', '#image.image', { src: "img/img.png" });
        const rendered = element.render();
        expect(rendered).to.equal('<img id="image" class="image" src="img/img.png">');
    });

    it('throws when using duplicate attributes', () => {
        expect(function () {
             new EmptyElement('img', { src: "img/img.png" }, { src: "img/img.png" });
        }).to.throw('Attributes field has been declared twice.');
    });
});
