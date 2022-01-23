const automate = require('../automate')
const projectDir = `/usr/server/www/automate/projects/locweb-music/`
const productionDir = `/usr/server/dockers/locweb-music/`

const sshConfig = {
  host: '127.0.0.1',
  port: 2333,
  username: 'root',
}

async function run() {
  automate.checkEnv(['node', 'yarn', 'docker'])

  automate.cd(projectDir)
  automate.exec('pwd')
  automate.exec('git pull')
  automate.exec(`yarn install`)
  automate.exec(`yarn run builder serverDocker`, '构建中...')

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
