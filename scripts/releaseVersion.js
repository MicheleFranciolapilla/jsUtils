const fs = require('fs');
const { resolve, join } = require('path');
const { execSync } = require('child_process');

const branchesOptions = require('./data/branchesOptions.json');

const root = resolve(__dirname, '../');
const packagePath = join(root, 'package.json');
const worktreeFolder = '../gitWorktrees/jsUtils';
const execStdIO = 'inherit';
let version = '';
let tagExistsInSource;
let tagExistsInRelease;

/** @type {string[]} Branches allowed for processing */
const allowedBranches = [ 'source', 'release' ];

/** @type {boolean} Whether the script is forced (ignores existing tags) */
const isForced = process.argv.includes('--force');

/**
 * Executes a shell command synchronously.
 * @param {string} command - The shell command to execute.
 * @returns {{ someError: boolean, outcome?: Buffer, error?: Error }}
 */
const runCommand = (command) =>
{
    try
    {
        const outcome = execSync(command, { stdio : execStdIO });
        return { someError : false, outcome };
    }
    catch (error)
    {
        return { someError : true, error }
    }
}

/**
 * Checks if the given Git tag does NOT exist.
 * @param {string} tag - The Git tag to check.
 * @returns {boolean} True if the tag does not exist (i.e. it's new).
 */
const isANewTag = (tag) => runCommand(`git rev-parse --verify --quiet "refs/tags/${tag}"`).someError;

/**
 * Deletes a Git tag locally and remotely.
 * @param {string} tag - The Git tag to delete.
 * @returns {{ someError: boolean, outcome?: Buffer, error?: Error }}
 */
const clearTag = (tag) => runCommand(`git tag -d ${tag} && git push --delete origin ${tag}`);

/**
 * Retrieves and validates the version string from package.json.
 * @returns {{ someError: boolean, errorMsg?: string }}
 */
const retrieveVersion = () =>
{
    let errorIndex = 0;
    try
    {
        const pkgContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        version = pkgContent.version;
        if (!version || (typeof version !== 'string') || (version.split('.').length !== 3) || version.trim().split('.').some( (versionItem) => (versionItem !== parseInt(versionItem).toString())))
        {
            errorIndex++;
            throw new Error('❌ The file [ package.json ] does not have a valid string field [ version ] (format: x.y.z where x,y,z are integer)');
        }
        version = version.trim();
        return { someError : false };
    }
    catch (error)
    {
        return { someError : true, errorMsg : (errorIndex === 0) ? '❌ The file [ package.json ] is not a valid JSON file!' : error.message }
    }
}

/**
 * Clears a folder, preserving specific items if provided.
 * @param {string} folder - The folder path to clear.
 * @param {string[]} [itemsToPreserve=[]] - Files/folders to preserve.
 */
const clearFolder = (folder, itemsToPreserve = []) => 
    (fs.existsSync(folder) && fs.statSync(folder).isDirectory())
    ?   fs.readdirSync(folder).forEach( (item) =>
            {
                const itemFullPath = join(folder, item);
                const statItem = fs.statSync(itemFullPath);
                if ((statItem.isFile() && !itemsToPreserve.includes(item)) || (statItem.isDirectory() && !itemsToPreserve.includes(`${item}/`)))
                {
                    try
                    {
                        fs.rmSync(itemFullPath, { recursive : true });
                    }
                    catch (error)
                    {
                        throw error;
                    }
                }
            })
    :   (() => { throw new Error(`The directory [ ${folder} ] does not exist`) })();

/**
 * Copies selected items from source to destination folder.
 * @param {string} sourceFolder - The origin folder.
 * @param {string} destinationFolder - The target folder.
 * @param {string[]} itemsToCopy - List of files/directories to copy.
 */
const copyItems = (sourceFolder, destinationFolder, itemsToCopy) => 
    (fs.existsSync(sourceFolder) && fs.statSync(sourceFolder).isDirectory())
    ?   ((fs.existsSync(destinationFolder) && fs.statSync(destinationFolder).isDirectory())
        ?   fs.readdirSync(sourceFolder).forEach( (item) =>
                {
                    const itemFullPath = join(sourceFolder, item);
                    const statItem = fs.statSync(itemFullPath);
                    if ((statItem.isFile() && itemsToCopy.includes(item)) || (statItem.isDirectory() && itemsToCopy.includes(`${item}/`)))
                    {
                        try
                        {
                            fs.cpSync(itemFullPath, join(destinationFolder, item), { recursive : true, force : true });
                        }
                        catch (error)
                        {
                            throw error;
                        }
                    }
                })
        :   (() => { throw new Error(`The directory [ ${destinationFolder} ] does not exist`) })())
    :   (() => { throw new Error(`The directory [ ${sourceFolder} ] does not exist`) })();

/**
 * Scans and processes branch options from branchesOptions.json
 * (clearing, copying, modifying files, running commands).
 * @throws Will throw if config is missing or invalid.
 */
const scanOptions = () =>
{
    for (const branch of allowedBranches)
    {
        const branchObj = branchesOptions.find( (obj) => (obj.branch === branch));
        if (!branchObj || (typeof branchObj !== 'object'))
            throw new Error('File [ ./data/branchesOptions.json ] corrupted!');
        console.log(`🚧 Preparing branch [ ${branch} ]`);
        const branchFolder = join(root, worktreeFolder, branch);
        const { clearBefore, preserve, copy, filesContent, run } = branchObj;
        if (clearBefore === true)
        {
            console.log(`🛠️  Cleaning folder`);
            clearFolder(branchFolder, preserve ?? []);    
            console.log(`✔️  Folder cleaned!`);    
        }
        if (copy && Array.isArray(copy) && copy.length !== 0)
        {
            console.log(`🛠️  Copying files`);
            copyItems(root, branchFolder, copy);
            console.log(`✔️  Files copied!`);
        }
        if (filesContent && Array.isArray(filesContent))
        {
            filesContent.forEach( (fcObj) => 
                {
                    console.log(`🛠️  Updating [ ${fcObj.file} ]`);
                    const currentFile = join(branchFolder, fcObj.file);
                    if (!fs.existsSync(currentFile))
                        throw new Error(`The file [ ${currentFile} ] is defined in the field [ filesContent ] but does not exist in the related branch [ ${branch} ]!`);
                    if (typeof fcObj.content === 'string')
                        fs.writeFileSync(currentFile, fcObj.content);
                    else if (fcObj.content && (typeof fcObj.content === 'object'))
                    {
                        const { remove } = fcObj.content;
                        const jsonContent = JSON.parse(fs.readFileSync(currentFile, 'utf8'));
                        if (remove && Array.isArray(remove))
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
                            fs.writeFileSync(currentFile, JSON.stringify(jsonContent, null, 2));
                        }
                    }
                    console.log(`✔️  File [ ${fcObj.file} ] updated!`);
                });
        }
        if (run && Array.isArray(run))
            run.forEach( (command) => 
                {
                    console.log(`🛠️  Running script [ ${command} ]`);
                    const { someError, error } = runCommand(command);
                    if (someError)
                        throw error;
                    else
                        console.log(`✔️  Script [ ${command} ] ran!`);     
                });
        console.log(`👍 Branch [ ${branch} ] prepared!`);
    }
}

/**
 * Commits changes in all branches, creates Git tags and pushes to remote.
 * Reverts commits if any tagging operation fails.
 */
const commitAndTag = () =>
{
    const committedBranches = [];
    let canPushTag = true;
    for (const branch of allowedBranches)
    {
        console.log(`🛠️  Staging / Committing / Pushing changes for the branch [ ${branch} ]`);
        if (!canPushTag)
            break;
        const branchFolder = join(root, worktreeFolder, branch);
        const tagStr = `v${version}${(branch === 'source') ? '-src' : ''}`;
        runCommand(`git -C "${branchFolder}" add .`);
        const { someError, error } = runCommand(`git -C "${branchFolder}" commit -m "${(branch === 'source') ? '📦 Source' : '🚀 Compiled'} release ${tagStr}"`);
        if (someError)
        {
            // @ts-ignore
            console.log(`❌ ${error.message}`);
            canPushTag = false;
        }
        else
        {
            runCommand(`git -C "${branchFolder}" push origin ${branch}`);
            console.log(`✔️  Done!`);
            committedBranches.push(branch);
        }
    }
    if (canPushTag)
    {
        for (const branch of allowedBranches)
        {
            console.log(`🛠️  Tagging branch [ ${branch} ]`);
            const branchFolder = join(root, worktreeFolder, branch);
            const tagStr = `v${version}${(branch === 'source') ? '-src' : ''}`;
            if (((branch === 'source') && tagExistsInSource) || ((branch === 'release') && tagExistsInRelease))
            {
                console.log(`🛠️  Forcing existing tag [ ${tagStr} ] clearing`);
                clearTag(tagStr);
            }
            console.log(`🛠️  Tagging [ ${tagStr} ]`);
            runCommand(`git -C "${branchFolder}" tag ${tagStr}`);
            console.log(`✔️  Branch [ ${branch} ] tagged!`);
        }
        console.log(`🛠️  Pushing tags to remote repo`);
        runCommand(`git push --tags`);
        console.log(`✔️  Remote repo updated!`);
    }
    else
        for (const branch of committedBranches)
        {
            console.log(`🛠️  Resetting commit for branch [ ${branch} ]`);
            const branchFolder = join(root, worktreeFolder, branch); 
            runCommand(`git -C "${branchFolder}" reset --hard HEAD~1`);
            runCommand(`git -C "${branchFolder}" push origin HEAD --force`);
            console.log(`✔️  Done!`);
        }
}

/**
 * Main function that orchestrates the release process.
 * @throws Will throw if prerequisites or Git operations fail.
 */
const scriptExecutor = () =>
{
    console.log('⚙️ New version release process starts');
    if (!fs.existsSync(packagePath))
        throw new Error('❌ File [ package.json ] not found! The current script must be located into a subfolder of the root folder.');
    const { someError, errorMsg } = retrieveVersion();
    if (someError)
        throw new Error(errorMsg);
    console.log(`🔧 Version: [ ${version} ]`);
    tagExistsInSource = !isANewTag(`v${version}-src`);
    tagExistsInRelease = !isANewTag(`v${version}`);
    if (!isForced && (tagExistsInSource || tagExistsInRelease))
        throw new Error('The current version is already tagged');
    scanOptions();
    commitAndTag();
    console.log(`✅ The new version [ ${version} ] was successfully released!`);
}

scriptExecutor();

