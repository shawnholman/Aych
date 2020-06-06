import { expect } from 'chai';
import {NestableElement} from "../src/elements";
import {If} from "../src/If";

describe('If', () => {
    it('renders an empty div if true', () => {
        const element = new If(true, new NestableElement('div'));
        const rendered = element.render();
        expect(rendered).to.equal('<div></div>');
    });

    it('does not render an empty div if false', () => {
        const element = new If(false, new NestableElement('div'));
        const rendered = element.render();
        expect(rendered).to.equal('');
    });

    it('renders string literals', () => {
        const element = new If(true, 'hey');
        const rendered = element.render();
        expect(rendered).to.equal('hey');
    });
});
