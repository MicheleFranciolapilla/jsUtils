import type { Environments } from '../types/environment';

const isNode = () : boolean => ((typeof process !== 'undefined') && !!process.versions?.node);

const isNodeCJS = () : boolean => (isNode() && (typeof require === 'function'));

const isNodeESM = () : boolean => (isNode() && !isNodeCJS());

const isBrowser = () : boolean => ((typeof window !== 'undefined') && (typeof document !== 'undefined'));

const isWebWorker = () : boolean => ((typeof self !== 'undefined') && (typeof window === 'undefined'));

const getEnvironment = () : Environments =>
    isNodeCJS()
    ?   'node-cjs'
    :   (isNodeESM()
        ?   'node-esm'
        :   (isBrowser()
            ?   'browser'
            :   (isWebWorker()
                ?   'web-worker'
                :   'unknown')));

export { isNode, isNodeCJS, isNodeESM, isBrowser, isWebWorker, getEnvironment };