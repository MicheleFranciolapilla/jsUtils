// @ts-ignore
const { isNotNull, isDefined, isAValidNumber, isAValidArray, isAValidObjectKey, isAValidObject, cloneObject, deepFreeze } = require('./index');

const randomBool = () => Math.random() < 0.5;

describe('jsUtils', () => 
    {
        describe('isNotNull', () => 
            {
                it('should return false for null', () => expect(isNotNull(null)).toBe(false));
                it('should return true for undefined', () => expect(isNotNull(undefined)).toBe(true));
                it('should return true for object', () => expect(isNotNull({})).toBe(true));
            });

        describe('isDefined', () => 
            {
                it('should return false for undefined', () => expect(isDefined(undefined)).toBe(false));
                it('should return false for null with checkForNull=true', () => expect(isDefined(null, true)).toBe(false));
                it('should return true for empty string and checkForNull=true', () => expect(isDefined('', true)).toBe(true));
                it('should return true for 0 and checkForNull=true', () => expect(isDefined(0, true)).toBe(true));
                it('should return true for NaN and checkForNull=true', () => expect(isDefined(NaN, true)).toBe(true));
            });

        describe('isAValidNumber', () => 
            {
                const falsyInputs = [NaN, Infinity, -Infinity, null, undefined, '5', [5], {2: 4}, true];
                falsyInputs.forEach( (input) => 
                    {
                        it(`should return false for invalid input: ${String(input)}`, () => 
                            {
                                const result = isAValidNumber(input, { allowZero: randomBool(), allowNegatives: randomBool(), allowDecimals: randomBool() });
                                expect(result).toBe(false);
                            });
                    });

                it('should handle valid edge cases correctly', () => 
                    {
                        expect(isAValidNumber(0, { allowZero : true })).toBe(true);
                        expect(isAValidNumber(0, { allowZero : false })).toBe(false);
                        expect(isAValidNumber(-0, { allowZero : true })).toBe(true);
                        expect(isAValidNumber(0.00005, { allowDecimals : false })).toBe(false);
                        expect(isAValidNumber(0.00005, { allowDecimals : true })).toBe(true);
                        expect(isAValidNumber(-1e-50, { allowZero : false, allowNegatives : true, allowDecimals : true })).toBe(true);
                        expect(isAValidNumber(1e-76, { allowDecimals : true })).toBe(true);
                    });
            });

        describe('isAValidArray', () => 
            {
                it('should return false for object input', () => expect(isAValidArray({}, { allowEmpty: true })).toBe(false));
                it('should return false for empty array with allowEmpty=false', () => expect(isAValidArray([], { allowEmpty: false })).toBe(false));
                it('should return true for empty array with allowEmpty=true', () => expect(isAValidArray([], { allowEmpty: true })).toBe(true));
                it('should return true for non-empty array', () => expect(isAValidArray([null], { allowEmpty: true })).toBe(true));
                it('should return false for null', () => expect(isAValidArray(null, { allowEmpty: true })).toBe(false));
            });

        describe('isAValidObjectKey', () => 
            {
                it('should return false for non-string or empty/whitespace strings', () => [123, null, undefined, {}, '', '   '].forEach( (val) => expect(isAValidObjectKey(val)).toBe(false)));
                it('should return true for valid non-strict keys', () => 
                    {
                        expect(isAValidObjectKey('key ')).toBe(true);
                        expect(isAValidObjectKey('_123')).toBe(true);
                    });
                it('should validate strict keys correctly', () => 
                    {
                        expect(isAValidObjectKey('validKey', true)).toBe(true);
                        expect(isAValidObjectKey('_validKey123', true)).toBe(true);
                        expect(isAValidObjectKey('k1-k2', true)).toBe(true);
                        expect(isAValidObjectKey('1startWithNumber', true)).toBe(false);
                        expect(isAValidObjectKey('-dashStart', true)).toBe(false);
                        expect(isAValidObjectKey('has space', true)).toBe(false);
                    });
            });

        describe('isAValidObject', () => 
            {
                it('should return false for non-object values', () => [null, [], 'string', 123].forEach( (value) => expect(isAValidObject(value)).toBe(false)));
                it('should validate minProperties and requiredProperties', () => 
                    {
                        expect(isAValidObject({ a : 1 }, { minProperties : 2 })).toBe(false);
                        expect(isAValidObject({ a : 1, b : 2 }, { minProperties : 2 })).toBe(true);
                        expect(isAValidObject({ a : 1 }, { requiredProperties: ['a', 'b'] })).toBe(false);
                        expect(isAValidObject({ a : 1, b : 2 }, { requiredProperties: ['a'] })).toBe(true);
                        expect(isAValidObject({ a : 1 }, { requiredProperties: ['a'] })).toBe(true);
                    });
            });

        describe('cloneObject', () => 
            {
                it('should deeply clone a serializable object', () => 
                    {
                        const obj = { a : 1, b : { c : 2 } };
                        const cloned = cloneObject(obj);
                        expect(cloned).toEqual(obj);
                        expect(cloned).not.toBe(obj);
                        // @ts-ignore
                        expect(cloned.b).not.toBe(obj.b);
                    });
                it('should return null for circular objects', () => 
                    {
                        const circular = {}; 
                        circular['self'] = circular;
                        expect(cloneObject(circular)).toBeNull();
                    });
                it('should handle JSON strings if isStringified=true', () => 
                    {
                        const jsonStr = '{"x":42}';
                        expect(cloneObject(jsonStr, true)).toEqual({ x : 42 });
                        expect(cloneObject('not json', true)).toBeNull();
                    });
            });

        describe('deepFreeze', () => 
            {
                it('should leave primitives untouched', () => 
                    {
                        expect(deepFreeze(123)).toBe(123);
                        expect(deepFreeze(null)).toBe(null);
                        expect(deepFreeze(undefined)).toBe(undefined);
                    });
                it('should freeze objects and nested structures', () => 
                    {
                        const obj = { a : { b : { c : 3 } } };
                        const frozen = deepFreeze(obj);
                        expect(Object.isFrozen(frozen)).toBe(true);
                        // @ts-ignore
                        expect(Object.isFrozen(frozen.a)).toBe(true);
                        // @ts-ignore
                        expect(Object.isFrozen(frozen.a.b)).toBe(true);
                    });
                it('should freeze arrays and items', () => 
                    {
                        const arr = [ { x : 1 }, { y : 2 } ];
                        const frozen = deepFreeze(arr);
                        expect(Object.isFrozen(frozen)).toBe(true);
                        // @ts-ignore
                        expect(Object.isFrozen(frozen[0])).toBe(true);
                    });
                it('should return already frozen object as-is', () => 
                    {
                        const obj = Object.freeze({ frozen : true });
                        expect(deepFreeze(obj)).toBe(obj);
                    });
            });
    });
