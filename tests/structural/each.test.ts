import {expect} from 'chai';
import {NestableElement} from "../../src/elements/NestableElement";
import {Each} from "../../src/structural/Each";

describe('Each', () => {
    const TEST_ARRAY = ['dog', 'cat', 'rat'];
    const TEST_SET = new Set(TEST_ARRAY);

    it('renders nothing if the list is empty', () => {
        const element = new Each([], new NestableElement('div'));
        const rendered = element.render();
        expect(rendered).to.equal('');
    });

    it('renders a list of div\'s via the built in templates', () => {
        const element = new Each(TEST_ARRAY, new NestableElement('div', '{{i}}:{{item}}'));
        const rendered = element.render();
        expect(rendered).to.equal('<div>0:dog</div><div>1:cat</div><div>2:rat</div>');
    });

    it('renders a list of strings via built in templates', () => {
        const element = new Each(TEST_ARRAY,'{{i}}:{{item}};');
        const rendered = element.render();
        expect(rendered).to.equal('0:dog;1:cat;2:rat;');
    });

    it('renders a list of strings via built in templates using a set', () => {
        const element = new Each(TEST_SET,'{{i}}:{{item}};');
        const rendered = element.render();
        expect(rendered).to.equal('0:dog;1:cat;2:rat;');
    });

    it ('renders a list of strings via built in templates (using a modified index string)', () => {
        const element = new Each(TEST_ARRAY,'{{j}}:{{item}};');
        const rendered = element.setIndexName('j').render();
        expect(rendered).to.equal('0:dog;1:cat;2:rat;');
    });

    it ('renders a list of strings via built in templates (using a modified item string)', () => {
        const element = new Each(TEST_ARRAY,'{{i}}:{{thing}};');
        const rendered = element.setItemName('thing').render();
        expect(rendered).to.equal('0:dog;1:cat;2:rat;');
    });

    it('renders a list of div\'s via the EachRenderFunction', () => {
        const element = new Each(TEST_ARRAY, (item, i) => new NestableElement('div', `${i}:${item}`));
        const rendered = element.render();
        expect(rendered).to.equal('<div>0:dog</div><div>1:cat</div><div>2:rat</div>');
    });

    it('renders a list of strings via the EachRenderFunction', () => {
        const element = new Each(TEST_ARRAY, (item, i) => `${i}:${item};`);
        const rendered = element.render();
        expect(rendered).to.equal('0:dog;1:cat;2:rat;');
    });

    it('renders the empty element when the iterable is empty', () => {
        const element = new Each([],'{{i}}:{{thing}};').empty('empty');
        const element2 = new Each([],'{{i}}:{{thing}};').empty(new NestableElement('div'));
        const rendered = element.render();
        const rendered2 = element2.render();
        expect(rendered).to.equal('empty');
        expect(rendered2).to.equal('<div></div>');
    });

    it('renders an empty string if the iterable is empty and no empty element is set', () => {
        const element = new Each([],'{{i}}:{{thing}};');
        const rendered = element.render();
        expect(rendered).to.equal('');
    });

    it('handles nested each statements', () => {
        const element = new Each([1,2,3],
            new Each([1,2,3],
                new NestableElement('div', 'i: {{i}}, j: {{j}}; itemI: {{itemI}}, itemJ: {{itemJ}}'),
            'j', 'itemJ')
        ).setItemName('itemI');
        const render = element.render();
        expect(render).to.equal('<div>i: 0, j: 0; itemI: 1, itemJ: 1</div><div>i: 0, j: 1; itemI: 1, itemJ: 2</div><div>i: 0, j: 2; itemI: 1, itemJ: 3</div><div>i: 1, j: 0; itemI: 2, itemJ: 1</div><div>i: 1, j: 1; itemI: 2, itemJ: 2</div><div>i: 1, j: 2; itemI: 2, itemJ: 3</div><div>i: 2, j: 0; itemI: 3, itemJ: 1</div><div>i: 2, j: 1; itemI: 3, itemJ: 2</div><div>i: 2, j: 2; itemI: 3, itemJ: 3</div>');
    });

    it('iterates through an object using a render function with the help of Object.entries', () => {
        const data = {
            'k1': 'value1',
            'k2': 'value2',
            'k3': 'value3',
        };
        const element = new Each(Object.entries(data), ([key, value]) => {
            return key + '-' + value + '|';
        });
        const render = element.render();
        expect(render).to.equal('k1-value1|k2-value2|k3-value3|');
    });

    it('iterates through an object without a render function with the help of Object.entries', () => {
        const data = {
            'k1': 'value1',
            'k2': 'value2',
            'k3': 'value3',
        };
        const element = new Each(Object.entries(data), '{{item[0]}}-{{item[1]}}|');
        const render = element.render();
        expect(render).to.equal('k1-value1|k2-value2|k3-value3|');
    });
});
