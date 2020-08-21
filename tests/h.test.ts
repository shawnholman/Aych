import {H} from "../src/H";
import {expect} from 'chai';
import {Aych} from "../src/core/Aych";
import {Renderable} from "../src/core/Renderable";

describe('H', () => {
    describe('scopes', () => {
        it('scopes H without return statement', () => {
            H.$(({div}) => {
                expect(div().render()).to.equal('<div></div>');
            });
        });

        it ('scopes H with return statement and no render', () => {
            const render = H.$(({div}) => {
                return div();
            });
            expect(render).to.equal('<div></div>');
        });

        it ('scopes H with return statement and render (w/ render=true)', () => {
            const render = H.$(({div}) => {
                return div().render();
            });
            expect(render).to.equal('<div></div>');
        });

        it ('scopes H with return statement and external data', () => {
            const render = H.$(({div}) => {
                return div("{{text}}");
            }, {text:"Hey"});
            expect(render).to.equal('<div>Hey</div>');
        });

        it ('scopes H with return statement (w/ render=false)', () => {
            const renderer = H.$(({div}) => {
                return div("{{text}}");
            }, {}, false) as Renderable;
            const render = renderer.render({text:"Hey"});
            expect(render).to.equal('<div>Hey</div>');
        });

        it ('scopes H with return statement and render (w/ render=false)', () => {
            const renderer = H.$(({div}) => {
                return div("{{text}}").render({text:"Hey"});
            }, {}, false) as Renderable;
            const render = renderer.render();
            expect(render).to.equal('<div>Hey</div>');
        });

        it('scopes creates', () => {
            const render3 = H.$(() => {
                Aych.create('example', Aych.ElementType.EMPTY);
                return H.example();
            });
            expect(render3).to.equal('<example>');

            expect(() => {
                Aych.create('example', Aych.ElementType.EMPTY);
                Aych.destroy('example');
            }).to.not.throw();
        });
    });
    it('scopes Aych', () => {

        const render3 = H.$(() => {
            Aych.create('example', Aych.ElementType.EMPTY);
            return H.example();
        });
        expect(render3).to.equal('<example>');

        expect(() => {
            Aych.create('example', Aych.ElementType.EMPTY);
            Aych.destroy('example');
        }).to.not.throw();
    });

    describe('create', () => {
        it('creates a custom element', () => {
            Aych.create('rand', Aych.ElementType.NESTED);
            Aych.create('empty', Aych.ElementType.EMPTY);

            const element = H.rand().render();
            const element2 = H.empty().render();
            expect(element).to.equal("<rand></rand>");
            expect(element2).to.equal("<empty>");

            Aych.destroy('rand');
            Aych.destroy('empty');
        });

        it('returns the created tag name', () => {
            expect(Aych.create('empty', Aych.ElementType.EMPTY)).to.equal('empty');
            Aych.destroy('empty');
        });
``
        it('fails to create custom element if ElementType is not valid', () => {
            expect(() => Aych.create('tag', 3)).to.throw('ElementType does not exist');
        });

        it('fails to create a custom element if the identifier is invalid', () => {
            let invalidIdentifiers = ['', '   ', '___', '  __dsafs', 'aaAdSasd_sadasd', 'a-'];
            let validIdentifiers = ['a', '   imgg', 'c-wiz', 'SPAN', 'B   ', 'this-is-valid'];
            for(let id of invalidIdentifiers) {
                expect(() => Aych.create(id, Aych.ElementType.NESTED))
                    .to.throw('Tag names should start with a letter and only contain letters, numbers, and dashes between two characters (yes: the-tag-name, no: the---tag---name).');
                Aych.destroy(id);
            }
            for(let id of validIdentifiers) {
                expect(() => Aych.create(id, Aych.ElementType.NESTED)).to.not.throw('Tag names should start with a letter and only contain letters, numbers, and dashes between two characters (yes: the-tag-name, no: the---tag---name).');
                Aych.destroy(id);
            }
        });
    });

    describe('destroy', () => {
       it('removes an element definition', () => {
           expect(Aych.prototype).to.not.have.property('tagName');
           Aych.create('tag-name', Aych.ElementType.NESTED);

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

    describe('eachIn', () => {
        it('renders 4 div tags using renderable directly', () => {
            const element = H.$eachIn({
                'k1': 'val1',
                'k2': 'val2',
                'k3': 'val3',
                'k4': 'val4',
            }, H.div('{{item[0]}}:{{item[1]}}'));
            const render = element.render();
            expect(render).to.equal('<div>k1:val1</div><div>k2:val2</div><div>k3:val3</div><div>k4:val4</div>');
        });

        it('renders 4 div tags using renderable directly using EachFunction', () => {
            const element = H.$eachIn({
                'k1': 'val1',
                'k2': 'val2',
                'k3': 'val3',
                'k4': 'val4',
            }, ([key, value]) => H.div(key + ':' + value));
            const render = element.render();
            expect(render).to.equal('<div>k1:val1</div><div>k2:val2</div><div>k3:val3</div><div>k4:val4</div>');
        });
    })

    describe('repeat', () => {
        it('renders 4 div tags', () => {
            const element = H.$repeat(4, H.div('{{i}}'));
            const render = element.render();
            expect(render).to.equal('<div>0</div><div>1</div><div>2</div><div>3</div>');
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
    });
});