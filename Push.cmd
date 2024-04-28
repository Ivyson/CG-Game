@echo off
git status  REM Fetch the status and append it on the terminal to show how many files are modified in prep to push the work
git add .  
git commit -m"Auto-Push"
git push
git status Rem Retrieve the current status of the repo or the local file system relative to the repo