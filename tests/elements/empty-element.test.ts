import { expect } from 'chai';
import {EmptyElement} from "../../src/elements";

describe('EmptyElement', () => {
    it('renders img element without attributes', () => {
        const element = new EmptyElement('img');
        const rendered = element.render();
        expect(rendered).to.equal('<img>');
    });

    it('renders img element with an id', () => {
        const element = new EmptyElement('img', '#image');
        const rendered = element.render();
        expect(rendered).to.equal('<img id="image">');
    });

    it('renders img element with an class', () => {
        const element = new EmptyElement('img', '.image');
        const rendered = element.render();
        expect(rendered).to.equal('<img class="image">');
    });

    it('renders img element with an id and class', () => {
        const element = new EmptyElement('img', '#image.image');
        const rendered = element.render();
        expect(rendered).to.equal('<img id="image" class="image">');
    });

    it('renders img element with attributes', () => {
        const element = new EmptyElement('img', { src: "img/img.png" });
        const rendered = element.render();
        expect(rendered).to.equal('<img src="img/img.png">');
    });

    it('renders img element with attributes and id', () => {
        const element = new EmptyElement('img', '#image', { src: "img/img.png" });
        const rendered = element.render();
        expect(rendered).to.equal('<img id="image" src="img/img.png">');
    });

    it('renders img element with attributes and class', () => {
        const element = new EmptyElement('img', '.image', { src: "img/img.png" });
        const rendered = element.render();
        expect(rendered).to.equal('<img class="image" src="img/img.png">');
    });

    it('renders img element with attributes, id and class', () => {
        const element = new EmptyElement('img', '#image.image', { src: "img/img.png" });
        const rendered = element.render();
        expect(rendered).to.equal('<img id="image" class="image" src="img/img.png">');
    });
});
