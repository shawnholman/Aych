import { expect } from 'chai';
import { Piper } from '../../src/core';

describe('Piper', () => {
    it('adds a new pipe to piper', () => {
       Piper.install('test', () => {});

       expect(function () {
           Piper.pipe('', 'test');
       }).to.not.throw();
    });

    it('utilizes a pipe to transform text', () => {
        Piper.install('testArgument', (value: string, arg1: number, arg2: boolean, arg3: string, arg4: boolean) => {
            return value + arg1 + arg2 + arg3 + arg4;
        });

        let pipe = Piper.pipe('MyValue', 'testArgument', '1, true, hello, false');
        expect(pipe).to.equal('MyValue1truehellofalse');
    });

    it('throws an error if the pipe does not exist when called', () => {
        expect(function () {
            Piper.pipe('', 'undefinedTest');
        }).to.throw('Pipe does not exist: undefinedTest.');
    });

    it('throws an error if the pipe already exists when installed', () => {
        expect(function () {
            Piper.install('testee', () => {});
            Piper.install('testee', () => {});
        }).to.throw('Pipe already exists: testee.');
    });

    it('throws an error when trying to create a pipe with an improper pipe name', () => {
        expect(function () {
            Piper.install('     ', () => {});
        }).to.throw('Pipe names must only contain letters. Whitespaces are trimmed.');
        expect(function () {
            Piper.install('123', () => {});
        }).to.throw('Pipe names must only contain letters. Whitespaces are trimmed.');
        expect(function () {
            Piper.install('  tester  ', () => {});
        }).to.not.throw();
    });
});