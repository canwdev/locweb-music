// music_folder_player.properties parser tool

/*
Example:
#This file was created by Music Folder Player.
#Mon Nov 09 03:46:43 GMT+08:00 2020
position=25796
filesize=15126207
file=145. Caspian - Loft.mp3
time=1604864803658
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {getSafePath} = require("./fs-tool")

const filename = '.music_folder_player.properties'
const generateComment = (date = new Date()) => `#This file was created by Music Folder Player.\n#${date.toString()}\n`

const parseFile = async (filePath) => {
  // console.log(filePath)
  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileStream = fs.createReadStream(filePath);

  // http://nodejs.cn/api/readline/example_read_file_stream_line_by_line.html
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  const result = {}
  for await (const line of rl) {
    // console.log(`${line}`);
    if (/^#/.test(line)) {
      continue
    }
    const [key, value] = line.split(/=(.+)/)
    result[key] = value
  }
  // console.log(result)
  return result
}

const parseFromFolder = folderPath => parseFile(path.join(folderPath, getSafePath(filename)))

const stringify = (obj, date = new Date()) => {
  obj.time = date.getTime()
  let str = generateComment(date)
  for (let key in obj) {
    str += `${key}=${obj[key]}\n`
  }

  // console.log(str)
  return str
}

const writeFile = (filePath, obj, date) => {
  const str = stringify(obj, date)
  // console.log('writeFile', filePath, str)
  fs.writeFileSync(filePath, str, {encoding: 'utf8'})
}

const writeToFolder = (folderPath, obj, date) => writeFile(path.join(folderPath, getSafePath(filename)), obj, date)

module.exports = {
  filename,
  parseFile,
  parseFromFolder,
  stringify,
  writeFile,
  writeToFolder,
}
