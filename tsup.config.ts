import { defineConfig } from 'tsup';

export default defineConfig(
    {
        entry       :   ['src/index.ts'],
        outDir      :   'dist',
        format      :   ['cjs', 'esm'],
        target      :   'es6',
        sourcemap   :   true,
        clean       :   true,
        dts         :   true,
        minify      :   true
    });