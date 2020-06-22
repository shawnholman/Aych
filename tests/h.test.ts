import {H} from "../src/H";
import {expect} from 'chai';
import {Aych} from "../src/core/Aych";

describe('H', () => {
    before(() => {
        Aych.create(Aych.ElementType.NESTED, 'rand');
        Aych.create(Aych.ElementType.EMPTY, 'empty');
    });

    describe('create', () => {
        it('creates a custom element', () => {
            Aych.create(Aych.ElementType.NESTED, 'rand');
            Aych.create(Aych.ElementType.EMPTY, 'empty');

            const element = H.rand().render();
            const element2 = H.empty().render();
            expect(element).to.equal("<rand></rand>");
            expect(element2).to.equal("<empty>");
        });

        it('fails to create custom element if ElementType is not valid', () => {
            expect(function () {
                Aych.create(3, 'tag');
            }).to.throw('ElementType does not exist');
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
        });

        it('composes an element that accepts templates', () => {
            Aych.compose('divWidth', (width: string) => {
                return H.div({ width: width }, '{{name}}');
            });

            const element = H.divWidth(100);
            const render = element.render({ name: "Tester" });
            expect(render).to.equal('<div width="100">Tester</div>');
        });
    });


    describe('string', () => {
        it('render a string with templates', () => {
            const element = H.string('Hey {{name}}!');
            const render = element.render({name: "Tester"});
            expect(render).to.equal('Hey Tester!');
        });
    });

    describe('each', () => {
       it('renders 4 div tags', () => {
           const element = H.each([1,2,3,4], H.div('{{index}}:{{val}}'), 'index', 'val');
           const render = element.render();
           expect(render).to.equal('<div>0:1</div><div>1:2</div><div>2:3</div><div>3:4</div>');

           const {Each} = H;

           const element2 = Each([1,2,3,5], H.div('{{index}}:{{val}}'), 'index', 'val');
           const render2 = element2.render();
           expect(render2).to.equal('<div>0:1</div><div>1:2</div><div>2:3</div><div>3:5</div>');
       });
    });

    describe('group', () => {
        it('renders a group', () => {
            const element = H.group('1', '2', '3', '4');
            const render = element.render();
            expect(render).to.equal('1234');

            const {Group} = H;
            const element2 = Group('1', '2', '3', '4', '5');
            const render2 = element2.render();
            expect(render2).to.equal('12345');
        });
    });

    describe('if', () => {
       it('renders an element', () => {
           const element = H.if(true, '1', '2');
           const render = element.render();
           expect(render).to.equal('1');

           const {If} = H;
           const element2 = If(false, '1', '2');
           const render2 = element2.render();
           expect(render2).to.equal('2');
       });
    });

    describe('switch', () => {
        it('renders an element', () => {
            const element = H.switch('1',
                H.case('1', '1'),
                H.case('2', '2'),
                H.case('3', '3')
            );
            const render = element.render();
            expect(render).to.equal('1');

            const element2 = H.switch(2,
                H.case(1, '1'),
                H.case(2, '2'),
                H.case(3, '3'),
            );
            const render2 = element2.render();
            expect(render2).to.equal('2');

            const {Switch, Case} = H;
            const element3 = Switch('3',
                Case('1', '1'),
                Case('2', '2'),
                Case('3', '3')
            );
            const render3 = element3.render();
            expect(render3).to.equal('3');

            const element4 = Switch(4,
                Case(1, '1'),
                Case(2, '2'),
                Case(3, '3'),
                Case(4, '4')
            );
            const render4 = element4.render();
            expect(render4).to.equal('4');
        });
    })
});