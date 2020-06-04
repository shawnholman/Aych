import { expect } from 'chai';
import { StringLiteral } from '../src/StringLiteral';
import {SimpleObject} from "../src/interfaces";

describe('StringLiteral', () => {
    it('renders string literal without template', () => {
        const string = new StringLiteral("this is a string");
        const render = string.render();
        expect(string.hasTemplate()).to.be.false;
        expect(render).to.equal("this is a string");
    });

    it('renders string literal with template', () => {
        const string = new StringLiteral("{{this}} is a {{string}}");
        const render = string.render({
            "this": "this",
            "string": "string",
        });
        expect(string.hasTemplate()).to.be.true;
        expect(render).to.equal("this is a string");
    });
});
