import {expect} from 'chai';
import {NestableElement} from "../../src/elements/NestableElement";
import {Group} from "../../src/structural/Group";

describe('Group', () => {
    it('renders an empty group', () => {
        const element = new Group();
        const rendered = element.render();
        expect(rendered).to.equal('');
        expect(element.getMembers()).to.have.lengthOf(0);
    });

    it('properly groups together a mixture of string literals and elements', () => {
        const element = new Group('hey', new NestableElement('div'), '', 'bye');
        const rendered = element.render();
        expect(rendered).to.equal('hey<div></div>bye');
        // empty string literal is ignored
        expect(element.getMembers()).to.have.lengthOf(3);
    });
});