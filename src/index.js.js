/**
 * @function isNotNull
 * Checks if a value is not null.
 * @param {*} value - The value to check.
 * @returns {boolean}
 */
const isNotNull = (value) => (value !== null);

/**
 * @function isDefined
 * Checks if a value is defined (not undefined), and optionally not null.
 * @param {*} value - The value to check.
 * @param {boolean} [checkForNull=false] - Whether to also check for null.
 * @returns {boolean}
 */
const isDefined = (value, checkForNull = false) => ((value !== undefined) && (!checkForNull || isNotNull(value)));

/**
 * @function isAValidNumber
 * Validates whether a value is a number, with optional rules.
 * @param {*} value - The value to check.
 * @param {Object}  [options] - Validation options.
 * @param {boolean} [options.allowZero=false] - Allow zero.
 * @param {boolean} [options.allowNegatives=false] - Allow negative numbers.
 * @param {boolean} [options.allowDecimals=false] - Allow decimal numbers.
 * @returns {boolean}
 */
const isAValidNumber = (value, options = {}) =>
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
 * Checks whether the input is a valid array, optionally allowing/disallowing empty arrays.
 * @param {*} arrayToCheck - The array to validate.
 * @param {Object}  [options] - Validation options.
 * @param {boolean} [options.allowEmpty=true] - Allow empty arrays.
 * @returns {boolean}
 */
const isAValidArray = (arrayToCheck, options = {}) => 
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
 * The check can be performed in strict or non-strict mode, depending on the value of the optional boolean parameter `strict`.
 *
 * @param {*} key - The value to check for validity as an object key.
 * @param {boolean} [strict=false] - 
 *  If `false`, only performs minimal validation: the value must be a string and not empty or whitespace-only.
 *  If `true`, the key must also match a stricter pattern: it must start with a letter or underscore, and contain only letters, digits, underscores, or hyphens.
 *
 * @returns {boolean} `true` if the key is valid according to the selected mode, otherwise `false`.
 */
const isAValidObjectKey = (key, strict = false) => ((typeof key === 'string') && (key.trim().length > 0)) && (!strict || /^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(key));

/**
 * @function isAValidObject
 * Checks whether an object is valid, with optional requirements.
 * @param {*} objToCheck - The object to validate.
 * @param {Object}          [options] - Validation options.
 * @param {Array<string>}   [options.requiredProperties=[]] - List of required properties.
 * @param {number}          [options.minProperties=0] - Minimum number of properties required.
 * @returns {boolean}
 */
const isAValidObject = (objToCheck, options = {}) =>
{
    // @ts-ignore
    const requiredProperties =  (isAValidArray(options.requiredProperties, { allowEmpty : false }) && options.requiredProperties.every( (property) => isAValidObjectKey(property, true)))
                                ?   options.requiredProperties
                                :   [];
    const minProperties =   isAValidNumber(options.minProperties, { allowZero : true }) ? Number(options.minProperties) : 0;

    if (!objToCheck || (typeof objToCheck !== 'object') || Array.isArray(objToCheck))
        return false;
    const objProperties = Object.keys(objToCheck);
    if (objProperties.length < minProperties)
        return false;
    // @ts-ignore
    if ((requiredProperties.length !== 0) && (requiredProperties.some( (property) => !objProperties.includes(property))))
        return false;
    return true;
}

/**
 * @function cloneObject
 * Creates a deep clone of an object using JSON methods.
 * @param {*} objToClone - The object to clone.
 * @param {boolean} [isStringified=false] - If true, assumes the input is already a JSON string.
 * @returns {*} The cloned object, or null if cloning fails.
 */
const cloneObject = (objToClone, isStringified = false) => 
{
    try
    {
        const stringified = isStringified ? objToClone : JSON.stringify(objToClone);
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
 * - Non-objects (primitives, null, undefined) are returned as-is.
 * - Already frozen objects are not processed again.
 * - Arrays and their elements are also recursively frozen.
 * 
 * @param {*} objToFreeze - The value to freeze deeply if it is an object or array.
 * @returns {*} The frozen object/array or the original value if not an object.
 */
const deepFreeze = (objToFreeze) => 
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
                const propertyValue = objToFreeze[property];
                if (propertyValue && (typeof propertyValue === 'object'))
                    deepFreeze(propertyValue);
            });
    return Object.freeze(objToFreeze);
};

module.exports = { isNotNull, isDefined, isAValidNumber, isAValidArray, isAValidObjectKey, isAValidObject, cloneObject, deepFreeze }