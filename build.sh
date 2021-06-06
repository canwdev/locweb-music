#git pull
yarn config set registry https://registry.npm.taobao.org
yarn config set disturl https://npm.taobao.org/dist

yarn &&
cd ./frontend && yarn && yarn build &&
cd .. &&
#pm2 restart ./ecosystem.config.js
#tar cf dist.tar --exclude-from=.tarignore *
tar cf dist.tar $(ls -I "frontend" -I "data" -I "config/config.json" -I "*.tar")
#docker build -t locweb-music .
