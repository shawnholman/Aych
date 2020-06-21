import {expect} from 'chai';
import {NestableElement} from "../../src/elements/NestableElement";
import {Switch} from "../../src/structural/Switch";

const Case = Switch.Case;
describe('Switch', () => {
    it('renders the correct case (typeof string)', () => {
        const element = new Switch<string>('two',
            new Case<string>('one', new NestableElement('span')),
            new Case<string>('two', new NestableElement('div')),
            new Case<string>('three', new NestableElement('strong'))
        );
        const rendered = element.render();
        expect(rendered).to.equal('<div></div>');
    });

    it('renders the default case when a value is not found (typeof string)', () => {
        const element = new Switch<string>('four',
            new Case<string>('one', new NestableElement('span')),
            new Case<string>('two', new NestableElement('div')),
            new Case<string>('three', new NestableElement('strong'))
        ).default(new NestableElement('h1'));
        const rendered = element.render();
        expect(rendered).to.equal('<h1></h1>');
    });

    it ('renders empty string when a value is not found and no default value is given (typeof string)', () => {
        const element = new Switch<string>('four',
            new Case<string>('one', new NestableElement('span'))
        );
        const rendered = element.render();
        expect(rendered).to.equal('');
    });

    it('renders the correct case (typeof number)', () => {
        const element = new Switch<number>(2,
            new Case<number>(1, new NestableElement('span')),
            new Case<number>(2, 'case2'),
            new Case<number>(3, new NestableElement('strong'))
        );
        const rendered = element.render();
        expect(rendered).to.equal('case2');
    });

    it('renders the default case when a value is not found (typeof number)', () => {
        const element = new Switch<number>(4,
            new Case<number>(1, new NestableElement('span')),
            new Case<number>(2, new NestableElement('div')),
            new Case<number>(3, new NestableElement('strong'))
        ).default('default');
        const rendered = element.render();
        expect(rendered).to.equal('default');
    });

    it ('renders empty string when a value is not found and no default value is given (typeof number)', () => {
        const element = new Switch<number>(4,
            new Switch.Case<number>(1, new NestableElement('span'))
        );
        const rendered = element.render();
        expect(rendered).to.equal('');
    });
});