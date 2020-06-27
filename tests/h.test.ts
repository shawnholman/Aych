import {H} from "../src/H";
import {expect} from 'chai';
import {Aych} from "../src/core/Aych";

describe('H', () => {
    it('scopes Aych', () => {
        H.$(({div}) => {
            expect(div().render()).to.equal('<div></div>');
        });

        const render = H.$(({div}) => {
            return div();
        });
        expect(render).to.equal('<div></div>');

        const render2 = H.$(({div}) => {
            return div().render();
        });
        expect(render2).to.equal('<div></div>');

        const render3 = H.$(() => {
            Aych.create(Aych.ElementType.EMPTY, 'example');
            return H.example();
        });
        expect(render3).to.equal('<example>');

        expect(() => {
            Aych.create(Aych.ElementType.EMPTY, 'example');
            Aych.destroy('example');
        }).to.not.throw();
    });

    describe('create', () => {
        it('creates a custom element', () => {
            Aych.create(Aych.ElementType.NESTED, 'rand');
            Aych.create(Aych.ElementType.EMPTY, 'empty');

            const element = H.rand().render();
            const element2 = H.empty().render();
            expect(element).to.equal("<rand></rand>");
            expect(element2).to.equal("<empty>");

            Aych.destroy('rand');
            Aych.destroy('empty');
        });

        it('returns the created tag name', () => {
            expect(Aych.create(Aych.ElementType.EMPTY, 'empty')).to.equal('empty');
            Aych.destroy('empty');
        });
``
        it('fails to create custom element if ElementType is not valid', () => {
            expect(() => Aych.create(3, 'tag')).to.throw('ElementType does not exist');
        });

        it('fails to create a custom element if the identifier is invalid', () => {
            let invalidIdentifiers = ['', '   ', '___', '  __dsafs', 'aaAdSasd_sadasd', 'a-'];
            let validIdentifiers = ['a', '   imgg', 'c-wiz', 'SPAN', 'B   ', 'this-is-valid'];
            for(let id of invalidIdentifiers) {
                expect(() => Aych.create(Aych.ElementType.NESTED, id))
                    .to.throw('Tag names should start with a letter and only contain letters, numbers, and dashes between two characters (yes: the-tag-name, no: the---tag---name).');
                Aych.destroy(id);
            }
            for(let id of validIdentifiers) {
                expect(() => Aych.create(Aych.ElementType.NESTED, id)).to.not.throw('Tag names should start with a letter and only contain letters, numbers, and dashes between two characters (yes: the-tag-name, no: the---tag---name).');
                Aych.destroy(id);
            }
        });
    });

    describe('destroy', () => {
       it('removes an element definition', () => {
           expect(Aych.prototype).to.not.have.property('tagName');
           Aych.create(Aych.ElementType.NESTED, 'tag-name');

           expect(Aych.prototype).to.have.property('tagName');
           // Also test that it gets trimmed
           Aych.destroy('  tag-name');
           expect(Aych.prototype).to.not.have.property('tagName');
       });

       it ('does not throw an error when destroying a non-existing property', () => {
           expect(Aych.prototype).to.not.have.property('tagName2');
           expect(() => Aych.destroy('    tag-name2')).to.not.throw();
           expect(Aych.prototype).to.not.have.property('tagName2');
       });
    });

    describe('compose', () => {
        it('composes an element', () => {
            Aych.compose('divWidth', (width: string) => {
                return H.div({ width: width });
            });

            const element = H.divWidth(100);
            const render = element.render();
            expect(render).to.equal('<div width="100"></div>');

            Aych.destroy('divWidth');
        });

        it('composes an element that accepts templates', () => {
            Aych.compose('divWidth', (width: string) => {
                return H.div({ width: width }, '{{name}}');
            });

            const element = H.divWidth(100);
            const render = element.render({ name: "Tester" });
            expect(render).to.equal('<div width="100">Tester</div>');

            Aych.destroy('divWidth');
        });

        it('fails when trying to create a composable that already exists', () => {
            Aych.compose('divWidth', (width: string) => {
                return H.div({ width: width }, '{{name}}');
            });

            expect(() => {
                Aych.compose('divWidth', (width: string) => {
                    return H.div({ width: width }, '{{name}}');
                });
            }).to.throw('You cannot define divWidth on Aych because it already exists. Please call Aych.destroy("divWidth") before redefining.');

            Aych.destroy('divWidth');
        });

        it('fails when trying to create a composable with an invalid name', () => {
            let invalidIdentifiers = ['', '   ', '___', '  __dsafs', 'aaAdSasd_sadasd', 'a-'];
            let validIdentifiers = ['a', 'imgg', '  cSwiz', 'SPAN', 'B  ', 'thisisvalid'];
            for(let id of invalidIdentifiers) {
                expect(() => Aych.compose(id, () => H.div()))
                    .to.throw('Composition names should start with a letter or underscore and only contain letters, numbers, dashed, and underscores throughout.');
                Aych.destroy(id);
            }
            for(let id of validIdentifiers) {
                console.dir(Aych.prototype);
                expect(() => Aych.compose(id, () => H.div())).to.not.throw();
                Aych.destroy(id);
            }
        });
    });


    describe('string', () => {
        it('render a string with templates', () => {
            const element = H.string('Hey {{name}}!');
            const render = element.render({name: "Tester"});
            expect(render).to.equal('Hey Tester!');
        });

        it('render unescaped string', () => {
            const element = H.unescaped('Hey <div></div>');
            const render = element.render();
            expect(render).to.equal('Hey <div></div>');
        });
    });

    describe('each', () => {
       it('renders 4 div tags', () => {
           const element = H.$each([1,2,3,4], H.div('{{index}}:{{val}}'), 'index', 'val');
           const render = element.render();
           expect(render).to.equal('<div>0:1</div><div>1:2</div><div>2:3</div><div>3:4</div>');
       });
    });

    describe('group', () => {
        it('renders a group', () => {
            const element = H.$group('1', '2', '3', '4');
            const render = element.render();
            expect(render).to.equal('1234');
        });
    });

    describe('if', () => {
       it('renders an element', () => {
           const element = H.$if(true, '1', '2');
           const render = element.render();
           expect(render).to.equal('1');
       });
    });

    describe('switch', () => {
        it('renders an element', () => {
            const element = H.$switch('1',
                H.$case('1', '1'),
                H.$case('2', '2'),
                H.$case('3', '3')
            );
            const render = element.render();
            expect(render).to.equal('1');

            const element2 = H.$switch(2,
                H.$case(1, '1'),
                H.$case(2, '2'),
                H.$case(3, '3'),
            );
            const render2 = element2.render();
            expect(render2).to.equal('2');
        });
    })
});