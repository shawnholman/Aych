import {H} from "../src/H";
import {expect} from 'chai';
import {Aych} from "../src/core/Aych";

describe('H', () => {
    it('creates a custom element', () => {
       Aych.create(Aych.ElementType.Nested, 'rand');
       Aych.create(Aych.ElementType.Empty, 'empty');

       const element = H.rand().render();
       const element2 = H.empty().render();
       expect(element).to.equal("<rand></rand>");
       expect(element2).to.equal("<empty>");
    });

    it('fails to create custom element if ElementType is not valid', () => {
        expect(function () {
            Aych.create(3, 'rand');
        }).to.throw();
    });

    it('composes an element', () => {
        Aych.compose('divWidth', (width: string) => {
            return H.div({ width: width });
        });

        const element = H.divWidth(100);
        const render = element.render();
        expect(render).to.equal('<div width="100"></div>');
    });

    it('composes an element that accepts templates', () => {
        Aych.compose('divWidth', (width: string) => {
            return H.div({ width: width }, '{{name}}');
        });

        const element = H.divWidth(100);
        const render = element.render({ name: "Tester" });
        expect(render).to.equal('<div width="100">Tester</div>');

        delete Aych.prototype.divWidth;
    });

    it('creates a StringLiteral and renders it with templates', () => {
       const element = H.string('Hey {{name}}!');
       const render = element.render({name: "Tester"});
       expect(render).to.equal('Hey Tester!');
    });
});