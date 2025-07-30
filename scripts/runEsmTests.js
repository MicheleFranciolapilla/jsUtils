const { execSync } = require('child_process');
const { resolve, join } = require('path');
const { existsSync, rmSync, renameSync, mkdirSync } = require('fs');

const testFolder = resolve(__dirname, '../', 'src/__tests__/esmTests');
const compiledUtilsPath = join(testFolder, 'utils');
const compiledFile = 'environmentUtils';
const compiledFilePath = join(compiledUtilsPath, compiledFile);

try
{
    if (!existsSync(testFolder))
        mkdirSync(testFolder);
    execSync('tsc -p tsconfig.esmTests.json', { stdio : 'inherit' });
    renameSync(`${compiledFilePath}.js`, `${compiledFilePath}.mjs`);
    execSync(`node "${join(compiledUtilsPath, '../../', 'esmTests.mjs')}"`, { stdio : 'inherit' });
}
catch(error)
{
    console.log('❌ Fatal Error');
    console.log(error.stack || error.message || error);
}
finally
{
    if (existsSync(testFolder))
        rmSync(testFolder, { force : true, recursive: true });
}
