import {expect} from 'chai';
import {StringLiteral} from '../../src/core/StringLiteral';

const THIS_IS = {
    "this": {
        is: {}
    }
};

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

    it('renders string literal after template pipes (no arguments)', () => {
        const string = new StringLiteral('{{this|uppercase}} is a {{string}}');
        const render = string.render({
            'this': 'this',
            'string': 'string',
        });
        expect(render).to.equal('THIS is a string');
    });

    it('renders string literal after template pipes (with arguments)', () => {
        const string = new StringLiteral('{{this|substr(0,5)}} is a {{string}}');
        const render = string.render({
            'this': 'this123',
            'string': 'string',
        });
        expect(render).to.equal('this1 is a string');
    });

    it('renders string with deep literal', () => {
        const string = new StringLiteral('{{this.is.a.deep[2].literal}}');
        const render = string.render({
            'this': {
                is: {
                    a: {
                        deep: [1,2, { literal: 'really!' }]
                    }
                }
            }
        });
        expect(render).to.equal('really!');
    });

    it('renders without throwing errors with optional', () => {
        const string = new StringLiteral('{{something?.was.a.deep[2].literal}}');
        const render = string.render(THIS_IS);
        expect(render).to.equal('');

        const string2 = new StringLiteral('{{this.was?.a.deep[2].literal}}');
        const render2 = string2.render(THIS_IS);
        expect(render2).to.equal('');

        const string3 = new StringLiteral('{{this[2]?.was}}');
        const render3 = string3.render({
            'this': [0, 0]
        });
        expect(render3).to.equal('');
    });

    it('throws an error if the template cannot be found', () => {
        expect(function () {
            const string = new StringLiteral('{{this.was.a.deep[2].literal}}');
            string.render(THIS_IS);
        }).to.throw('was is not a property of this.');

        expect(function () {
            const string = new StringLiteral('{{something}}');
            string.render({});
        }).to.throw('something is undefined.');
    });

    it('throws an error if the value of the key does not return an array', () => {
        expect(function () {
            const string = new StringLiteral('{{this[2].was.a.deep[2].literal}}');
            string.render(THIS_IS);
        }).to.throw('this is not an array.');

        expect(function () {
            const string = new StringLiteral('{{this[2]?.was.a.deep[2].literal}}');
            string.render(THIS_IS);
        }).to.throw('this is not an array.');
    });

    it('throws an error if the templates array index out of bounds', () => {
        const arrayObj = {
            'array': [1, 2, 3, 4],
        };

        expect(function () {
            const string = new StringLiteral('{{array[-2]}}');
            string.render(arrayObj);
        }).to.throw('Index out of bounds: array[-2].');

        expect(function () {
            const string = new StringLiteral('{{array[-2]?}}');
            string.render(arrayObj);
        }).to.not.throw();

        expect(function () {
            const string = new StringLiteral('{{array[32]}}');
            string.render(arrayObj);
        }).to.throw('Index out of bounds: array[32].');

        expect(function () {
            const string = new StringLiteral('{{array[32]?}}');
            string.render(arrayObj);
        }).to.not.throw();
    });
});
