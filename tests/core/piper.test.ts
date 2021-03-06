import {expect} from 'chai';
import {Piper} from '../../src/core/Piper';
import {TemplateParser} from "../../src/core/TemplateParser";

describe('Piper', () => {
    describe('built-in pipes', () => {
        it('uppercase', () => {
            expect(Piper.pipe('testword', 'uppercase')).to.equal('TESTWORD');
        });
        it('lowercase',() => {
            expect(Piper.pipe('TESTWORD', 'lowercase')).to.equal('testword');
        });
        it('substr',() => {
            expect(Piper.pipe('testword', 'substr', '')).to.equal('testword');
            expect(Piper.pipe('testword', 'substr', '0')).to.equal('testword');
            expect(Piper.pipe('testword', 'substr', '2')).to.equal('stword');
            expect(Piper.pipe('testword', 'substr', '0, 3')).to.equal('tes');
            expect(Piper.pipe('testword', 'substr', '2, 4')).to.equal('stwo');
            expect(Piper.pipe('testword', 'substr', '2, 40')).to.equal('stword');
        });
        it('==', () => {
            expect(Piper.pipe('hello', '==', 'hello')).to.equal('true');
            expect(Piper.pipe('hey', '==', 'hello')).to.equal('false');
        });
        it('!=', () => {
            expect(Piper.pipe('hello', '!=', 'hello')).to.equal('false');
            expect(Piper.pipe('hey', '!=', 'hello')).to.equal('true');
        });
        it('>', () => {
            expect(Piper.pipe('2', '>', '10')).to.equal('false');
            expect(Piper.pipe('12', '>', '10')).to.equal('true');
        });
        it('<', () => {
            expect(Piper.pipe('2', '<', '10')).to.equal('true');
            expect(Piper.pipe('12', '<', '10')).to.equal('false');
        });
        it('>=', () => {
            expect(Piper.pipe('2', '>=', '10')).to.equal('false');
            expect(Piper.pipe('10', '>=', '10')).to.equal('true');
            expect(Piper.pipe('12', '>=', '10')).to.equal('true');
        });
        it('<=', () => {
            expect(Piper.pipe('2', '<=', '10')).to.equal('true');
            expect(Piper.pipe('10', '<=', '10')).to.equal('true');
            expect(Piper.pipe('12', '<=', '10')).to.equal('false');
        });
    });

    it('registers a new pipe', () => {
       Piper.register('test', () => 'test');

       expect(() => Piper.pipe('', 'test')).to.not.throw();
    });

    it('deregisters a pipe', () => {
        Piper.register('testerPipe', () => 'test');
        const deleted = Piper.deregister('testerPipe');

        expect(deleted).to.be.true;
        expect(() => Piper.pipe('', 'testerPipe')).to.throw();
    });

    it('returns false when deregistering an unexisting pipe', () => {
        const deleted = Piper.deregister('someInvalidPipe');

        expect(deleted).to.be.false;
    });

    it('utilizes a pipe to transform text', () => {
        Piper.register('testArgument', (value: string, arg1: number, arg2: boolean, arg3: string, arg4: boolean) => {
            return value + arg1 + arg2 + arg3 + arg4;
        });

        const pipe = Piper.pipe('MyValue', 'testArgument', '1, true, hello, false');
        expect(pipe).to.equal('MyValue1truehellofalse');
    });

    it ('copies a pipe', () => {
        // This takes the testArgument from the previous test and copies it (alias).
        Piper.copy('testArgument', 'testArgumentTwo');

        const pipe = Piper.pipe('MyValue', 'testArgumentTwo', '1, true, hello, false');
        expect(pipe).to.equal('MyValue1truehellofalse');
    });

    it ('copies a pipe and modifies it', () => {
        // This takes the testArgument from the previous test, copies it, and modifies it.
        Piper.copy('testArgument', 'testArgumentThree', false, (original, value, arg1: number, arg2: boolean, arg3: string, arg4: boolean) => {
            return original(value, arg1, arg2, arg3, arg4) + "-updated";
        });

        const pipe = Piper.pipe('MyValue', 'testArgumentThree', '1, true, hello, false');
        expect(pipe).to.equal('MyValue1truehellofalse-updated');
    });

    it ('creates an alias of a pipe', () => {
        // This takes the testArgument from the previous test and creates an alias.
        Piper.alias('testArgument', 'testArgumentFour');

        const pipe = Piper.pipe('MyValue', 'testArgumentFour', '1, true, hello, false');
        expect(pipe).to.equal('MyValue1truehellofalse');
    });


    it ('deregisters all copies of an alias', () => {
        Piper.register('somePipeOne', () => 'test');
        Piper.alias('somePipeOne', 'somePipeTwo');
        Piper.alias('somePipeOne', 'somePipeThree');

        expect(Piper.pipe('', 'somePipeOne', '')).to.equal('test');
        expect(Piper.pipe('', 'somePipeThree', '')).to.equal('test');
        expect(Piper.pipe('', 'somePipeTwo', '')).to.equal('test');

        Piper.deregister('somePipeOne');
        expect(() => Piper.pipe('', 'somePipeTwo'))
            .to.throw('Pipe does not exist: somePipeTwo.');
        expect(() => Piper.pipe('', 'somePipeThree'))
            .to.throw('Pipe does not exist: somePipeThree.');

        Piper.register('somePipeOne', () => 'test');
        Piper.alias('somePipeOne', 'somePipeTwo');
        Piper.alias('somePipeTwo', 'somePipeThree');


        expect(Piper.pipe('', 'somePipeOne', '')).to.equal('test');
        expect(Piper.pipe('', 'somePipeThree', '')).to.equal('test');
        expect(Piper.pipe('', 'somePipeTwo', '')).to.equal('test');

        Piper.deregister('somePipeTwo');
        expect(() => Piper.pipe('', 'somePipeOne'))
            .to.throw('Pipe does not exist: somePipeOne.');
        expect(() => Piper.pipe('', 'somePipeThree'))
            .to.throw('Pipe does not exist: somePipeThree.');
    });

    it ('updates a pipe', () => {
        // This takes the testArgument from the previous test and update it.
        Piper.update('testArgument', (original, value, arg1: number, arg2: boolean, arg3: string, arg4: boolean) => {
            return original(value, arg1, arg2, arg3, arg4) + "-updated";
        });

        const pipe = Piper.pipe('MyValue', 'testArgument', '1, true, hello, false');
        expect(pipe).to.equal('MyValue1truehellofalse-updated');
    });

    it('throws an error when trying to create a alias with the copy method and define an update function', () =>{
        expect(() => {
            Piper.copy('', ' ', true, (original, str) => str);
        }).to.throw('Alias should retain original function.');
    });

    it('throws an error when trying to copy a non-existing pipe', () => {
        expect(() => {
            Piper.copy('undefinedTest', ' ', false, (original, str) => str);
        }).to.throw('Pipe does not exist: undefinedTest.');
    });

    it('throws an error if trying to create an alias with an existing pipe name', () => {
        expect(function () {
            // Already aliased in an earlier test.
            Piper.alias('testArgument', 'testArgumentFour');
        }).to.throw('Pipe already exists: testArgumentFour')
    });

    it('throws an error if trying to create an alias with the same name', () => {
        expect(function () {
            Piper.alias('testArgument', 'testArgument');
        }).to.throw('Cannot alias with the same pipe name.')
    });

    it('throws an error when trying to update a non-existing pipe', () => {
        expect(() => {
            Piper.update('undefinedTest', (original, str) => str);
        }).to.throw('Pipe does not exist: undefinedTest.');
    });

    it('throws an error when trying to call a non-existing pipe', () => {
        expect(() => Piper.pipe('', 'undefinedTest'))
            .to.throw('Pipe does not exist: undefinedTest.');
    });

    it('throws an error when trying to install an existing pipe', () => {
        expect(() => {
            Piper.register('testee', () => 'test');
            Piper.register('testee', () => 'test');
        }).to.throw('Pipe already exists: testee.');
    });

    it('throws an error when trying to create a pipe with an improper pipe name', () => {
        expect(() => Piper.register('', () => 'test'))
            .to.throw('Pipe names must only contain letters. Whitespaces are trimmed.');
        expect(() => Piper.register('     ', () => 'test'))
            .to.throw('Pipe names must only contain letters. Whitespaces are trimmed.');
        expect(() => Piper.register('123', () => 'test'))
            .to.throw('Pipe names must only contain letters. Whitespaces are trimmed.');
        expect(() => Piper.register('  tester  ', () => 'test')).to.not.throw();
    });
});
