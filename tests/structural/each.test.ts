import { expect } from 'chai';
import {NestableElement} from "../../src/elements";
import {Each} from "../../src/structural";

describe('Each', () => {
    const TEST_ARRAY = ['dog', 'cat', 'rat'];

    it('renders nothing if the list is empty', () => {
        const element = new Each([], new NestableElement('div'));
        const rendered = element.render();
        expect(rendered).to.equal('');
    });

    it('renders a list of div\'s utilizing the built in templates', () => {
        const element = new Each(TEST_ARRAY, new NestableElement('div', '{{i}}:{{item}}'));
        const rendered = element.render();
        expect(rendered).to.equal('<div>0:dog</div><div>1:cat</div><div>2:rat</div>');
    });

    it('renders a list of div\'s utilizing an EachRenderFunction', () => {
        const element = new Each(TEST_ARRAY, (item, i) => new NestableElement('div', `${i}:${item}`));
        const rendered = element.render();
        expect(rendered).to.equal('<div>0:dog</div><div>1:cat</div><div>2:rat</div>');
    });

    it('renders a list of strings utilizing the built in templates', () => {
        const element = new Each(TEST_ARRAY,'{{i}}:{{item}};');
        const rendered = element.render();
        expect(rendered).to.equal('0:dog;1:cat;2:rat;');
    });

    it('renders a list of strings utilizing an EachRenderFunction', () => {
        const element = new Each(TEST_ARRAY, (item, i) => `${i}:${item};`);
        const rendered = element.render();
        expect(rendered).to.equal('0:dog;1:cat;2:rat;');
    });
});
