import {expect} from "chai";
import {Piper} from "../../src/core/Piper";
import {TemplateParser} from "../../src/core/TemplateParser";

const THIS_IS = {
    "this": {
        is: {}
    }
};

describe('TemplateParser', () => {
    it('renders string literal after template pipes (no arguments)', () => {
        const string = TemplateParser.template('{{this|uppercase}} is a {{string}}', {
            'this': 'this',
            'string': 'string',
        });
        const string2 = TemplateParser.template('{{this|uppercase()}} is a {{string}}', {
            'this': 'this',
            'string': 'string',
        });
        expect(string).to.equal('THIS is a string');
        expect(string2).to.equal('THIS is a string');
    });

    it('renders string literal after template pipes (with arguments)', () => {
        const string = TemplateParser.template('{{this|substr(0,5)}} is a {{string}}', {
            'this': 'this123',
            'string': 'string',
        });
        expect(string).to.equal('this1 is a string');
    });

    it('renders string literal after template pipes (with arguments that have spaces)', () => {
        Piper.register("addString", (str: string, toAdd: string) => {
            return str + toAdd;
        });
        const string = TemplateParser.template('{{empty|addString(hello world)}}', {
            'empty': ''
        });
        expect(string).to.equal('hello world');
    });

    it('renders string with deep literal', () => {
        const string = TemplateParser.template('{{this.is.a.deep[2].literal}}', {
            'this': {
                is: {
                    a: {
                        deep: [1,2, { literal: 'really!' }]
                    }
                }
            }
        });
        expect(string).to.equal('really!');
    });

    it('renders without throwing errors with optional', () => {
        const string = TemplateParser.template('{{something?.was.a.deep[2].literal}}', THIS_IS);
        expect(string).to.equal('');

        const string2 = TemplateParser.template('{{this.was?.a.deep[2].literal}}', THIS_IS);
        expect(string2).to.equal('');

        const string3 = TemplateParser.template('{{this[2]?.was}}', {
            'this': [0, 0]
        });
        expect(string3).to.equal('');
    });

    it('evaluates expression to true or false indirectly', () => {
        const eval1 = TemplateParser.evaluate('{{expression}}', {expression: true});
        const eval2 = TemplateParser.evaluate('{{expression}}', {expression: false});

        expect(eval1).to.equal(true);
        expect(eval2).to.equal(false);
    });

    it('evaluates expression using piper built-in operations', () => {
        expect(TemplateParser.evaluate('{{text|==(hello)}}', {text: "hello"})).to.equal(true);
        expect(TemplateParser.evaluate('{{text|==(hello)}}', {text: "hey"})).to.equal(false);
        expect(TemplateParser.evaluate('{{text|!=(hello)}}', {text: "hello"})).to.equal(false);
        expect(TemplateParser.evaluate('{{text|!=(hello)}}', {text: "hey"})).to.equal(true);

        expect(TemplateParser.evaluate('{{num|>(10)}}', {num: 2})).to.equal(false);
        expect(TemplateParser.evaluate('{{num|>(10)}}', {num: 12})).to.equal(true);
        expect(TemplateParser.evaluate('{{num|<(10)}}', {num: 2})).to.equal(true);
        expect(TemplateParser.evaluate('{{num|<(10)}}', {num: 12})).to.equal(false);

        expect(TemplateParser.evaluate('{{num|>=(10)}}', {num: 2})).to.equal(false);
        expect(TemplateParser.evaluate('{{num|>=(10)}}', {num: 10})).to.equal(true);
        expect(TemplateParser.evaluate('{{num|>=(10)}}', {num: 12})).to.equal(true);
        expect(TemplateParser.evaluate('{{num|<=(10)}}', {num: 2})).to.equal(true);
        expect(TemplateParser.evaluate('{{num|<=(10)}}', {num: 10})).to.equal(true);
        expect(TemplateParser.evaluate('{{num|<=(10)}}', {num: 12})).to.equal(false);
    });

    it('evaluates expression to false if the given string is not just a single template', () => {
        expect(TemplateParser.evaluate('{{num|<=(10)}} {{num|<=(10)}}', {num: 2})).to.equal(false);
        expect(TemplateParser.evaluate('{{num|<=(10)}} he', {num: 10})).to.equal(false);
        expect(TemplateParser.evaluate('hey {{num|<=(10)}}', {num: 2})).to.equal(false);
    });

    it('throws an error if the template cannot be found', () => {
        expect(function () {
            TemplateParser.template('{{this.was.a.deep[2].literal}}', THIS_IS);
        }).to.throw('was is not a property of this.');

        expect(function () {
            TemplateParser.template('{{something}}', {});
        }).to.throw('something is undefined.');
    });

    it('throws an error if the value of the key does not return an array', () => {
        expect(function () {
            TemplateParser.template('{{this[2].was.a.deep[2].literal}}', THIS_IS);
        }).to.throw('this is not an array.');

        expect(function () {
            TemplateParser.template('{{this[2]?.was.a.deep[2].literal}}', THIS_IS);
        }).to.throw('this is not an array.');
    });

    it('throws an error if the templates array index out of bounds', () => {
        const arrayObj = {
            'array': [1, 2, 3, 4],
        };

        expect(function () {
            TemplateParser.template('{{array[-2]}}', arrayObj);
        }).to.throw('Index out of bounds: array[-2].');

        expect(function () {
            TemplateParser.template('{{array[-2]?}}', arrayObj);
        }).to.not.throw();

        expect(function () {
            TemplateParser.template('{{array[32]}}', arrayObj);
        }).to.throw('Index out of bounds: array[32].');

        expect(function () {
            TemplateParser.template('{{array[32]?}}', arrayObj);
        }).to.not.throw();
    });
});