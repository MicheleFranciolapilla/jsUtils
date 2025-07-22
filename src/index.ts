// const { NumberValidationOptions, ArrayValidationOptions, ObjectValidationOptions } = require('./types/validationOptions');

import type { NumberValidationOptions, ArrayValidationOptions, ObjectValidationOptions } from './types/validationOptions';

/** @typedef {import('./types/validationOptions').NumberValidationOptions} NumberValidationOptions */
/** @typedef {import('./types/validationOptions').ArrayValidationOptions} ArrayValidationOptions */
/** @typedef {import('./types/validationOptions').ObjectValidationOptions} ObjectValidationOptions */

/**
 * @function isNotNull
 * Checks if a value is not `null`.
 * 
 * @param {unknown} value - The value to check.
 * @returns {boolean} `true` if `value` is not `null`, otherwise `false`.
 */
const isNotNull = (value : unknown) : boolean => (value !== null);

/**
 * @function isDefined
 * Checks if a value is defined (not `undefined`), and optionally also not `null`.
 * 
 * @param {unknown} value - The value to check.
 * @param {boolean} [checkForNull=false] - Whether to also check for `null`.
 * @returns {boolean} `true` if `value` is defined and (if `checkForNull = true`) not `null`, otherwise `false`.
 */
const isDefined = (value : unknown, checkForNull = false) : boolean => ((value !== undefined) && (!checkForNull || isNotNull(value)));

/**
 * @function isAValidNumber
 * Validates whether a value is a finite number, with optional rules.
 * 
 * @param {unknown} value - The value to check.
 * @param {NumberValidationOptions} [options] - Validation options (zero, negatives, decimals).
 * @returns {boolean} `true` if the value is a valid number according to the rules; otherwise `false`.
 */
const isAValidNumber = (value : unknown, options : NumberValidationOptions = {}) : boolean =>
{
    const { allowZero = false, allowNegatives = false, allowDecimals = false } = options;
    if (!((typeof value === 'number') && (Number.isFinite(value))))
        return false;
    const valueStr = String(value);
    if (['0', '-0'].includes(valueStr))
        return allowZero;
    if (valueStr.startsWith('-') && !allowNegatives)
        return false;
    if (!Number.isInteger(value) && !allowDecimals)
        return false;
    return true;
}

/**
 * @function isAValidArray
 * Checks whether the input is a valid array, optionally allowing or disallowing empty arrays.
 * 
 * @param {unknown} arrayToCheck - The array to validate.
 * @param {ArrayValidationOptions} [options] - Validation options.
 * @returns {boolean} `true` if `arrayToCheck` is a valid array according to the rules; otherwise `false`.
 */
const isAValidArray = (arrayToCheck : unknown, options : ArrayValidationOptions = {}) : boolean => 
{
    const { allowEmpty = true } = options;
    if (!((typeof arrayToCheck === 'object') && Array.isArray(arrayToCheck)))
        return false;
    if (!allowEmpty && (arrayToCheck.length === 0))
        return false;
    return true;
}

/**
 * @function isAValidObjectKey
 * Checks whether the provided parameter is a valid object key.
 * 
 * @param {unknown} key - The value to check for validity as an object key.
 * @param {boolean} [strict=false] - 
 *  If `false`, only checks that the key is a non-empty and non-whitespace-only string.
 *  If `true`, the key must start with a letter or underscore, and contain only letters, digits, underscores, or hyphens.
 * 
 * @returns {boolean} `true` if the key is valid according to the selected mode, otherwise `false`.
 */
const isAValidObjectKey = (key : unknown, strict = false) : boolean => ((typeof key === 'string') && (key.trim().length > 0)) && (!strict || /^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(key));

/**
 * @function isAValidObject
 * Checks whether an object is valid, based on optional rules like required properties or minimum number of properties.
 * 
 * @param {unknown} objToCheck - The object to validate.
 * @param {ObjectValidationOptions} [options] - Validation options.
 * @returns {boolean} `true` if the object is valid according to the rules; otherwise `false`.
 */
const isAValidObject = (objToCheck : unknown, options : ObjectValidationOptions = {}) : boolean =>
{
    const requiredProperties =  (isAValidArray(options?.requiredProperties, { allowEmpty : false }) && options.requiredProperties?.every( (property) => isAValidObjectKey(property, true)))
                                ?   options.requiredProperties
                                :   [];
    const minProperties =   isAValidNumber(options.minProperties, { allowZero : true }) ? Number(options.minProperties) : 0;

    if (!objToCheck || (typeof objToCheck !== 'object') || Array.isArray(objToCheck))
        return false;
    const objProperties = Object.keys(objToCheck);
    if (objProperties.length < minProperties)
        return false;
    if ((requiredProperties.length !== 0) && (requiredProperties.some( (property) => !objProperties.includes(property))))
        return false;
    return true;
}

/**
 * @function cloneObject
 * Creates a deep clone of an object using JSON serialization.
 * 
 * @param {unknown} objToClone - The object to clone.
 * @param {boolean} [isStringified=false] - If `true`, assumes the input is already a JSON string.
 * @returns {object | null} A deep-cloned object if successful; otherwise `null`.
 */
const cloneObject = (objToClone : unknown, isStringified = false) : object | null => 
{
    try
    {
        const stringified = isStringified ? ((typeof objToClone === 'string') ? objToClone : JSON.stringify(objToClone)) : JSON.stringify(objToClone);
        const clonedObj = JSON.parse(stringified);
        return clonedObj;
    }
    catch
    {
        return null;
    }
}

/**
 * @function deepFreeze
 * Recursively freezes an object and all nested objects/arrays, making them immutable.
 * 
 * - Non-objects (primitives, `null`, `undefined`) are returned as-is.
 * - Already frozen objects are not processed again.
 * - Arrays and their elements are also recursively frozen.
 * 
 * @param {unknown} objToFreeze - The value to freeze deeply if it is an object or array.
 * @returns {unknown} The deeply frozen object or the original value if not an object.
 */
const deepFreeze = (objToFreeze : unknown) : unknown => 
{
    // Return non-objects as-is (including undefined)
    if (!objToFreeze || (typeof objToFreeze !== 'object') || Object.isFrozen(objToFreeze))
        return objToFreeze;

    // Freeze properties before freezing the object itself
    if (Array.isArray(objToFreeze))
        objToFreeze.forEach( (item) => (item && (typeof item === 'object') && deepFreeze(item)));
    else
        Object.getOwnPropertyNames(objToFreeze).forEach( (property) => 
            {
                const propertyValue = (objToFreeze as Record<string, unknown>)[property];
                if (propertyValue && (typeof propertyValue === 'object'))
                    deepFreeze(propertyValue);
            });
    return Object.freeze(objToFreeze);
};

module.exports = { isNotNull, isDefined, isAValidNumber, isAValidArray, isAValidObjectKey, isAValidObject, cloneObject, deepFreeze }