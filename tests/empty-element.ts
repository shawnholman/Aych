import { expect } from 'chai';
import {EmptyElement} from "../src/EmptyElement";

describe('EmptyElement', () => {
    it('renders an empty element without attributes', () => {
        const element = new EmptyElement('img');
        const rendered = element.render();
        expect(rendered).to.equal('<img />');
    });
});
