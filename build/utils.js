const chalk = require('chalk')
const sh = require('shelljs')

function cd(dir, tip) {
  const result = sh.cd(dir)
  if (result.code === 1) sh.exit(1)
  tip && console.log(tip, sh.pwd().toString())
  return result
}

function exec(command, description) {
  console.log(`>>> ${description ? '✴️' : '🚀'} ${description || command}`)
  const result = sh.exec(command)
  if (result.code === 1) sh.exit(1)

  return result
}

function getStrLength(str) {
  return str.replace(/[\u0391-\uFFE5]/g, 'aa').length
}

function colorLog(data, title = 'Info', color = 'yellow') {
  const length = 60
  const titleLength = getStrLength(title)
  let halfLength = Math.ceil((length - titleLength - 2) / 2)
  if (halfLength <= 0) {
    halfLength = 1
  }
  const isOdd = titleLength % 2 === 1

  console.log(
    chalk[color].bold(`╭${'─'.repeat(halfLength)} ${title} ${'─'.repeat(isOdd ? (halfLength - 1) : halfLength)}╮\n`) +
    data.toString().trim() + '\n' +
    chalk[color].bold(`╰${'─'.repeat(length)}╯\n`)
  )
}

function arrayMove(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
  return arr // for testing
}

module.exports = {
  cd,
  exec,
  colorLog,
  arrayMove,
}
