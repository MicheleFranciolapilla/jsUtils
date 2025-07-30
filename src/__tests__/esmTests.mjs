// @ts-ignore
import { isNode, isNodeCJS, isNodeESM, isBrowser, isWebWorker, getEnvironment } from './esmTests/utils/environmentUtils.mjs';

const setProperSymbol = (boolMatch) => boolMatch ? '✅' : '❌';

const testFunction = (fn, expected) =>
{
    const result = fn();
    console.log(`- Test (in Node <ESM> environment) for the function [ ${fn.name} ]`);
    console.log(`${setProperSymbol(result === expected)}  The invocation "${fn.name}()" should return [ ${expected} ]. The returned value is [ ${result} ]\n`);
}

testFunction(isNode, true);
testFunction(isNodeCJS, false);
testFunction(isNodeESM, true);
testFunction(isBrowser, false);
testFunction(isWebWorker, false);
testFunction(getEnvironment, 'node-esm');