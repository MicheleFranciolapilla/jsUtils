import type { NumberValidationOptions, ArrayValidationOptions, ObjectValidationOptions } from '../types/validationOptions';

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
 * Checks whether the input is a valid array, optionally verifying minimum/maximum item count and uniqueness.
 *
 * @param {unknown} arrayToCheck - The value to validate as an array.
 * @param {ArrayValidationOptions} [options] - Optional validation rules.
 * @param {number} [options.minItems] - Minimum number of items required in the array.
 * @param {number} [options.maxItems] - Maximum number of items allowed in the array.
 * @param {boolean} [options.uniqueItems=false] - Whether all items in the array must be unique.
 *
 * @returns {boolean} `true` if `arrayToCheck` is a valid array according to the rules; otherwise `false`.
 *
 * @example
 * isAValidArray([1, 2, 3], { minItems: 2, maxItems: 5, uniqueItems: true });
 * true
 */
const isAValidArray = (arrayToCheck : unknown, options : ArrayValidationOptions = {}) : boolean => 
{
    const { uniqueItems = false } = options;
    const minItems : number = isAValidNumber(options.minItems, { allowZero : true }) ? options.minItems! : 0;
    const maxItems : number | undefined = (isAValidNumber(options.maxItems) && (options.maxItems! >= minItems)) ? options.maxItems : undefined;
    if (!((typeof arrayToCheck === 'object') && Array.isArray(arrayToCheck)))
        return false;
    const length = arrayToCheck.length;
    if ((length < minItems) || (isDefined(maxItems) && (length > maxItems!)))
        return false;
    if (uniqueItems && (new Set(arrayToCheck).size !== length))
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
    const requiredProperties =  (isAValidArray(options?.requiredProperties, { minItems : 1 }) && options.requiredProperties?.every( (property) => isAValidObjectKey(property, true)))
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

export { isNotNull, isDefined, isAValidNumber, isAValidArray, isAValidObjectKey, isAValidObject }