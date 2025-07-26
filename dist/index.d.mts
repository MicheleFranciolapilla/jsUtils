interface NumberValidationOptions {
    allowZero?: boolean;
    allowNegatives?: boolean;
    allowDecimals?: boolean;
}
interface ArrayValidationOptions {
    allowEmpty?: boolean;
}
interface ObjectValidationOptions {
    requiredProperties?: string[];
    minProperties?: number;
}

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
declare const isNotNull: (value: unknown) => boolean;
/**
 * @function isDefined
 * Checks if a value is defined (not `undefined`), and optionally also not `null`.
 *
 * @param {unknown} value - The value to check.
 * @param {boolean} [checkForNull=false] - Whether to also check for `null`.
 * @returns {boolean} `true` if `value` is defined and (if `checkForNull = true`) not `null`, otherwise `false`.
 */
declare const isDefined: (value: unknown, checkForNull?: boolean) => boolean;
/**
 * @function isAValidNumber
 * Validates whether a value is a finite number, with optional rules.
 *
 * @param {unknown} value - The value to check.
 * @param {NumberValidationOptions} [options] - Validation options (zero, negatives, decimals).
 * @returns {boolean} `true` if the value is a valid number according to the rules; otherwise `false`.
 */
declare const isAValidNumber: (value: unknown, options?: NumberValidationOptions) => boolean;
/**
 * @function isAValidArray
 * Checks whether the input is a valid array, optionally allowing or disallowing empty arrays.
 *
 * @param {unknown} arrayToCheck - The array to validate.
 * @param {ArrayValidationOptions} [options] - Validation options.
 * @returns {boolean} `true` if `arrayToCheck` is a valid array according to the rules; otherwise `false`.
 */
declare const isAValidArray: (arrayToCheck: unknown, options?: ArrayValidationOptions) => boolean;
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
declare const isAValidObjectKey: (key: unknown, strict?: boolean) => boolean;
/**
 * @function isAValidObject
 * Checks whether an object is valid, based on optional rules like required properties or minimum number of properties.
 *
 * @param {unknown} objToCheck - The object to validate.
 * @param {ObjectValidationOptions} [options] - Validation options.
 * @returns {boolean} `true` if the object is valid according to the rules; otherwise `false`.
 */
declare const isAValidObject: (objToCheck: unknown, options?: ObjectValidationOptions) => boolean;
/**
 * @function cloneObject
 * Creates a deep clone of an object using JSON serialization.
 *
 * @param {unknown} objToClone - The object to clone.
 * @param {boolean} [isStringified=false] - If `true`, assumes the input is already a JSON string.
 * @returns {object | null} A deep-cloned object if successful; otherwise `null`.
 */
declare const cloneObject: (objToClone: unknown, isStringified?: boolean) => object | null;
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
declare const deepFreeze: (objToFreeze: unknown) => unknown;

export { cloneObject, deepFreeze, isAValidArray, isAValidNumber, isAValidObject, isAValidObjectKey, isDefined, isNotNull };
