import {expect} from 'chai';
import {StringLiteral} from '../../src/core/StringLiteral';

describe('StringLiteral', () => {
    it('renders string literal without template', () => {
        const string = new StringLiteral('this is a string');
        const render = string.render();
        expect(render).to.equal('this is a string');
    });

    it('renders string literal with template', () => {
        const string = new StringLiteral('{{first}} is a {{last}}');
        const render = string.render({
            'first': 'this',
            'last': 'string',
        });
        expect(render).to.equal('this is a string');
    });

    it('converts anything to a string', () => {
        const string = new StringLiteral(10).render();
        const string2 = new StringLiteral(true).render();
        const string3 = new StringLiteral([1,2,3]).render();
        expect(string).to.equal('10');
        expect(string2).to.equal('true');
        expect(string3).to.equal('1,2,3');
    });

    it('renders string literal with escaped html characters', () => {
        const string = new StringLiteral('<div></div>');
        const render = string.render();
        expect(render).to.equal('&lt;div&gt;&lt;/div&gt;');
    });

    it('renders string literal without escaping html characters if "escape"=false', () => {
        const string = new StringLiteral('<div></div>', false);
        const render = string.render();
        expect(render).to.equal('<div></div>');
    });
});
