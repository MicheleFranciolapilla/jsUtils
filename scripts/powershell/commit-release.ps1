git -C ../gitWorktrees/jsUtils-release add .

if ((git -C ../gitWorktrees/jsUtils-release diff --cached).Length -gt 0) 
{
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    git -C ../gitWorktrees/jsUtils-release commit -m "Release build $timestamp"
    git -C ../gitWorktrees/jsUtils-release push
} 
else
{
    Write-Host "Nothing to commit"
}

