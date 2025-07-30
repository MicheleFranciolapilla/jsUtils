import type { Environments } from "../types/environment";
const { isNode, isNodeCJS, isNodeESM, isBrowser, isWebWorker, getEnvironment } = require('../utils/environmentUtils');

describe('Testing environmentUtils...', () =>
    {
        describe('- function [ isNode ]', () =>
            {
                const originalProcess = globalThis.process;

                afterEach( () => globalThis.process = originalProcess);

                it('should return `true` if [ process.versions.node ] is defined, so, no mocking is required, being actually in node environment', () => expect(isNode()).toBe(true));

                it('should return `false` if [ process ] is `undefined`', () =>
                    {
                        globalThis.process = undefined as any;
                        expect(isNode()).toBe(false);
                    });

                it('should return `false` if [ process.versions ] is missing', () =>
                    {
                        globalThis.process = { someKey : 'someValue' } as any;
                        expect(isNode()).toBe(false);
                    });
            });

        describe('- function [ isNodeCJS ]', () =>
            {
                it('should return `true` if [ require ] is `function`, so, no mocking is required, being actually in node environment, with [ type = commonjs ]', () => expect(isNodeCJS()).toBe(true));

                it.skip('*** Run `pnpm test:esm` or `pnpm test:all` ***', () => {/* This test is intentionally skipped because require cannot be undefined in CommonJS */});
            });

        describe('- function [ isNodeESM ]', () =>
            {
                it.skip('*** Run `pnpm test:esm` or `pnpm test:all` ***', () => {/* This test is intentionally skipped because import.meta cannot be defined in CommonJS */}); 

                it('should return `false` if [ import.meta ] is `undefined`, so, no mocking is required, being in node environment, with [ type = commonjs ]', () => expect(isNodeESM()).toBe(false));
            });

        describe('- function [ isBrowser ]', () =>
            {
                
            });
    });