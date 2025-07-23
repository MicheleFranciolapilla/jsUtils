import { defineConfig } from 'tsup';

export default defineConfig(
    {
        entry       :   ['src/index.ts'],
        outDir      :   '../gitWorktrees/jsUtils-release/dist',
        format      :   ['cjs', 'esm'],
        target      :   'es6',
        sourcemap   :   false,
        clean       :   true,
        dts         :   true,
        minify      :   true
    });