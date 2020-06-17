import { expect } from 'chai';
import {NestableElement} from "../../src/elements";
import {If} from "../../src/structural";

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
