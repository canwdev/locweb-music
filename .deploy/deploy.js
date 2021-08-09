const automate = require('../automate')
const projectDir = `/home/can/Projects/locweb-music/`
const prodFileName = `locweb-music-docker.tar`
const distFilePath = `/tmp/${prodFileName}`
const productionDir = `/usr/server/dockers/locweb-music/`
const dockerImageName = `locweb-music`

const sshConfig = {
  host: 'localhost',
  port: 22,
  username: 'root',
  privateKey: require('os').homedir() + '/.ssh/id_rsa'
}

async function run() {
  automate.checkEnv(['node', 'yarn', 'docker'])

  automate.cd(projectDir)
  automate.exec('pwd')
  automate.exec('git pull')
  // automate.exec(`su -c ./build.sh can`, '构建中...')
  automate.exec(`./build.sh`, '构建中...')
  // automate.exec(`su -c ./build.sh can`, '构建中...')

  automate.execCommands([
    `docker build -t ${dockerImageName} .`,
    `docker save -o ${distFilePath} ${dockerImageName}`,
  ], '构建 Docker 镜像...')

  automate.exec(`scp ${distFilePath} nas:${productionDir}`, 'scp 发送镜像中...')

  automate.exec(`ssh -T nas <<'EOL'
cd ${productionDir} &&
docker rmi ${dockerImageName} &&
docker load -i ${prodFileName} &&
./init.sh
EOL`, '执行远程命令')


  console.log(`>>> 部署成功`)

}

run()
