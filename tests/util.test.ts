import { expect } from 'chai';
import {merge} from "../src/Util";

describe('Util', () => {
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
