git pull &&
yarn &&
cd ./frontend && yarn && yarn build &&
cd .. &&
#pm2 restart ./ecosystem.config.js
tar cf dists.tar --exclude-from=.tarignore *
