const automate = require('../automate')
const projectDir = `/mnt/OmenSSD/server/automate/projects/locweb-music/`
const productionDir = `/usr/server/dockers/locweb-music/`

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
  // automate.exec(`./build.sh`, '构建中...')
  automate.exec(`./build-docker.sh`, 'Dockering...')

  await automate.sendFileExecuteCommands(sshConfig, null, [
    {
      dir: productionDir,
      command: 'pwd'
    },
    {
      dir: productionDir,
      command: './init.sh'
    }
  ])


  console.log(`>>> 部署成功`)

}

run()
