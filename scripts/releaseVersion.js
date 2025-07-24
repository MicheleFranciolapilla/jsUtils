const fs = require('fs');
const { resolve, join } = require('path');
const { execSync } = require('child_process');

const branchesOptions = require('./data/branchesOptions.json');

const root = resolve(__dirname, '../');
const allowedBranches = [ 'source', 'release' ];
const worktreeFolder = '../gitWorktrees/jsUtils';

const isForced = process.argv.includes('--force');
let version = '';

let errorIndex = -1;

const errorMsg = (index) =>
{
    const errorMsgs = 
    [
        '❌ File [ package.json ] not found! The current script must be located into a subfolder of the root folder.',
        '❌ The file [ package.json ] is not a valid JSON file!',
        '❌ The file [ package.json ] does not have a valid field [ version ] (format: x.y.z where x,y,z are integer)',
        `❌ The tag ${version}-src is already defined in [ source ] branch`,
        `❌ The tag ${version} is already defined in [ release ] branch`,
    ];
    console.error(errorMsgs[index]);
}

const isAValidVersion = (version) => 
{
    if (!version || (typeof version !== 'string'))
        return false;
    const splitted = version.split('.');
    if ((splitted.length !== 3) || splitted.some( (versionItem) => (versionItem !== parseInt(versionItem).toString())))
        return false;
    return true;
}

const isANewTag = (tag) =>
{
    try
    {
        execSync(`git rev-parse --verify --quiet "refs/tags/${tag}"`, { stdio : 'inherit' });
        return false;
    }
    catch
    {
        return true;
    }
}

const clearFolder = (folder, itemsToPreserve = []) =>
{
    fs.readdirSync(folder).forEach( (item) =>
        {
            const itemFullPath = join(folder, item);
            const statItem = fs.statSync(itemFullPath);
            if ((statItem.isFile() && !itemsToPreserve.includes(item)) || (statItem.isDirectory() && !itemsToPreserve.includes(`${item}/`)))
            {
                try
                {
                    fs.rmSync(itemFullPath, { recursive : true });
                }
                catch
                {
                    // Gestire l'errore
                }
            }
        });
}

const copyItems = (sourceFolder, destinationFolder, itemsToCopy) =>
{
    fs.readdirSync(sourceFolder).forEach( (item) =>
        {
            const itemFullPath = join(sourceFolder, item);
            const statItem = fs.statSync(itemFullPath);
            if ((statItem.isFile() && itemsToCopy.includes(item)) || (statItem.isDirectory() && itemsToCopy.includes(`${item}/`)))
                fs.cpSync(itemFullPath, join(destinationFolder, item), { recursive : true, force : true });
        });
}

const commitWithTag = (branch) =>
{
    const branchObj = branchesOptions.find( (obj) => (obj.branch === branch));
    if (branchObj)
    {
        const branchFolder = join(root, worktreeFolder, branch);
        if (branchObj.clearBefore)
            clearFolder(branchFolder, branchObj.preserve);
        if (branchObj.copy.length !== 0)
            copyItems(root, branchFolder, branchObj.copy);
        branchObj.filesContent.forEach( (fcObj) =>
            {
                const currentFile = join(branchFolder, fcObj.file);
                if (fs.existsSync(currentFile))
                {
                    if (typeof fcObj.content === 'string')
                        fs.writeFileSync(currentFile, fcObj.content);
                    else if (fcObj.content && (typeof fcObj.content === 'object'))
                    {
                        const jsonContent = JSON.parse(fs.readFileSync(currentFile, 'utf8'));
                        const { remove } = fcObj.content;
                        if (remove && Array.isArray(remove))
                        {
                            try
                            {
                                remove.forEach( (field) => 
                                    {
                                        if (field.includes('.'))
                                        {
                                            const keys = field.split('.');
                                            const lastKey = keys.pop();
                                            const parent = keys.reduce( (obj, key) => obj?.[key], jsonContent);
                                            if (parent)
                                                // @ts-ignore
                                                delete parent[lastKey];
                                        }
                                        else
                                            delete jsonContent[field];
                                    });
                            }
                            catch
                            {
                                // Gestire l'errore di parsing
                            }
                        }
                        fs.writeFileSync(currentFile, JSON.stringify(jsonContent, null, 2) + '\n');
                    }
                }
                // Gestire la non esistenza del file con errore
            });
        const { run } = branchObj;
        if (run && Array.isArray(run))
            run.forEach( (code) => execSync(code, { stdio : 'inherit' }));
        const tagStr = `v${version}${(branch === 'source') ? '-src' : ''}`;
        console.log("QUI ", tagStr)
        console.log("BRANCH FOLDER.... ", branchFolder)
        execSync(`git -C "${branchFolder}" add .`, { stdio : 'inherit' });
        console.log("add fatto")
        execSync(`git -C "${branchFolder}" commit -m "${(branch === 'source') ? '📦 Source' : '🚀 Binary'} release ${tagStr}"`, { stdio : 'inherit' });
        console.log("commit fatto")
        // Gestire il nothing to commit
        execSync(`git -C "${branchFolder}" tag ${tagStr}`, { stdio : 'inherit' });
        execSync(`git -C "${branchFolder}" push origin ${branch}`, { stdio : 'inherit' });
    }
    // Gestire l'errore in caso di inesistenza
}

try
{
    const packagePath = join(root, 'package.json');
    errorIndex++;
    if (!fs.existsSync(packagePath))
        throw new Error();
    errorIndex++;
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    errorIndex++;
    version = packageContent.version.trim();
    if (!isAValidVersion(version))
        throw new Error();
    errorIndex++;
    const tagExistsInSource = !isANewTag(`v${version}-src`);
    if (!isForced && tagExistsInSource)
        throw new Error();
    errorIndex++;
    const tagExistsInRelease = !isANewTag(`v${version}`);
    if (!isForced && tagExistsInRelease)
        throw new Error();
    if (tagExistsInSource) 
    {
        execSync(`git tag -d v${version}-src`, { stdio : 'inherit' });
        execSync(`git push --delete origin v${version}-src`, { stdio : 'inherit' })
    }
    if (tagExistsInRelease)
    {
        execSync(`git tag -d v${version}`, { stdio : 'inherit' });
        execSync(`git push --delete origin v${version}`, { stdio : 'inherit' })
    }
    for (const branch of allowedBranches)
    {
        const outcome = commitWithTag(branch);
    }
    execSync(`git push --tags`, { stdio : 'inherit' })
}
catch
{
    if (errorIndex >= 0)
    {
        errorMsg(errorIndex);
        process.exit(1);
    }
}
