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

export { cloneObject, deepFreeze }