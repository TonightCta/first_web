npm run build:master
git add .
git status
git commit -m '主站同步 - 同步图表标识'
git push origin dev
git checkout master 
git merge dev
git push origin master
git checkout dev