import {expect} from 'chai';
import {NestableElement} from "../../src/elements/NestableElement";
import {If} from "../../src/structural/If";

describe('If', () => {
    it('renders the renderable if true', () => {
        const element = new If(true, new NestableElement('div'));
        const rendered = element.render();
        expect(rendered).to.equal('<div></div>');
    });

    it('does not render the renderable if false', () => {
        const element = new If(false, new NestableElement('div'));
        const rendered = element.render();
        expect(rendered).to.equal('');
    });

    it('renders the else renderable if false', () => {
        const element = new If(false, new NestableElement('div'), new NestableElement('span'));
        const rendered = element.render();
        expect(rendered).to.equal('<span></span>');
    });

    it('renders the elif renderable if false', () => {
        const element =
            new If(false, new NestableElement('div'))
                .elif(false, new NestableElement('span'))
                .elif(true, new NestableElement('a'))
                .else(new NestableElement('img'));
        const rendered = element.render();
        expect(rendered).to.equal('<a></a>');
    });

    it('renders string literal if true', () => {
        const element = new If(true, 'hey');
        const rendered = element.render();
        expect(rendered).to.equal('hey');
    });

    it('does not render string literal if false', () => {
        const element = new If(false, 'hey');
        const rendered = element.render();
        expect(rendered).to.equal('');
    });

    it('renders the else string literal if false', () => {
        const element = new If(false, 'hey', 'bye');
        const rendered = element.render();
        expect(rendered).to.equal('bye');
    });

    it('renders the elif string if false', () => {
        const element =
            new If(false, 'div')
                .elif(false, 'span')
                .elif(true, 'a')
                .else('img');
        const rendered = element.render();
        expect(rendered).to.equal('a');
    });

    it('supports nested if statements', () => {
        const element =
            new If(false, 'hey',
                new If(false, 'bye', 'lie')
            );
        const rendered = element.render();
        expect(rendered).to.equal('lie');
    });

    it('uses the else method to set an else renderable', () => {
        const element = new If(false, new NestableElement('div')).else(new NestableElement('span'));
        const rendered = element.render();
        expect(rendered).to.equal('<span></span>');
    });

    it('uses the else method to set an else string literal', () => {
        const element = new If(false, 'hey').else('bye');
        const rendered = element.render();
        expect(rendered).to.equal('bye');
    });

    it('supports nested if statements using the else method', () => {
        const element =
            new If(false, 'hey').else(
                new If(false, 'bye').else('lie')
            );
        const rendered = element.render();
        expect(rendered).to.equal('lie');
    });

    /*it('renders element using the each method', () => {
        let element = new If(true, '{{i}}:{{item}}:{{additional?}};');

        expect(element.each([1,2,3]))
            .to.equal('0:1:;1:2:;2:3:;');
        expect(element.each([1,2,3], {additional: true}))
            .to.equal('0:1:true;1:2:true;2:3:true;');

        let element2 = new If(false, '{{i}}:{{item}};');
        expect(element2.each([1,2,3]))
            .to.equal('');
    });

    it('renders element using the repeat method', () => {
        let element = new If(true, '{{i}}:{{item}}:{{additional?}};');

        expect(element.repeat(3))
            .to.equal('0:0:;1:1:;2:2:;');
        expect(element.repeat(3, {additional: true}))
            .to.equal('0:0:true;1:1:true;2:2:true;');

        let element2 = new If(false, '{{i}}:{{item}}');
        expect(element2.repeat(3, {additional: 'true'}))
            .to.equal('');
    });

    it('renders element using the if method', () => {
        let element = new If(true, 'test:{{additional?}}');

        expect(element.if(true))
            .to.equal('test:');
        expect(element.if(true, {additional: true}))
            .to.equal('test:true');
        expect(element.if(false))
            .to.equal('');

        let element2 = new If(false, 'test::{{additional?}}');

        expect(element2.if(true))
            .to.equal('');
        expect(element2.if(false))
            .to.equal('');
    });*/
});
