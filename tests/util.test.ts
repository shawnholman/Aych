import {expect} from 'chai';
import {isAttributes, isRenderable, isString, merge} from "../src/Util";
import {Attributes, SimpleObject} from "../src/interfaces";
import {Renderable} from "../src/core";

describe('Util', () => {
    it ('can tell if the data type is a string', () => {
        const testString = 'hello';
        expect(isString(testString)).to.be.true;
        expect(isString(1)).to.be.false;
    });

    it ('can tell if the data type is an attribute', () => {
        const testAttribute: Attributes = {
            src: 'https://aychjs.com'
        };
        expect(isAttributes(testAttribute)).to.be.true;
        expect(isAttributes('')).to.be.false;
    });

    it ('can tell if the data type is an renderable', () => {
        class TestRenderable extends Renderable {
            protected internalRender(templates: SimpleObject): string {
                return "";
            }
        }
        const testRenderable = new TestRenderable();
        expect(isRenderable(testRenderable)).to.be.true;
        expect(isRenderable({})).to.be.false;
    });

    it('merges together two objects', () => {
       let obj1 = {
         1: 1,
         2: 2,
         3: 3,
         4: 4,
       };
        let obj2 = {
            1: 1,
            2: 4,
            3: 6,
            4: 8,
            5: 10,
        };

        expect(merge(obj1, obj2)).to.deep.equal({
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 10,
        });

        expect(merge(obj2, obj1)).to.deep.equal({
            1: 1,
            2: 4,
            3: 6,
            4: 8,
            5: 10,
        });
    });
});
