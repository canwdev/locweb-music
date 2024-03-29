// src: https://github.com/ustbhuangyi/lyric-parser/edit/master/src/index.js
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const STATE_PAUSE = 0
const STATE_PLAYING = 1

const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
}

export default class LyricParser {

  constructor(lrc, handler) {
    this.lrc = lrc
    this.tags = {}
    this.lines = []
    this.handler = handler
    this.state = STATE_PAUSE
    this.curLine = 0
    this.curNum = 0
    this.startStamp = 0
    this.pauseStamp = 0

    this._init()
  }

  _init() {
    this._initTag()
    this._initLines()
  }

  _initTag() {
    for (const tag in tagRegMap) {
      const matches = this.lrc.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'))
      this.tags[tag] = matches && matches[1] || ''
    }
  }

  _initLines() {
    const lines = this.lrc.split('\n')
    const offset = parseInt(this.tags['offset']) || 0
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const result = timeExp.exec(line)
      if (result) {
        const txt = line.replace(timeExp, '').trim()
        if (txt) {
          this.lines.push({
            // @ts-ignore
            time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 1 + offset,
            txt
          })
        }
      }
    }

    this.lines.sort((a, b) => {
      return a.time - b.time
    })
  }

  _findCurNum(time) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }

  _callHandler(i) {
    if (i < 0 || !this.handler) {
      return
    }
    // console.log('_callHandler', this)
    this.handler({
      txt: this.lines[i].txt,
      lineNum: i
    })
  }

  _playRest() {
    const line = this.lines[this.curNum]
    const delay = line.time - (+new Date() - this.startStamp)

    this.timer = setTimeout(() => {
      this._callHandler(this.curNum++)
      if (this.curNum < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest()
      }
    }, delay)
  }

  callHandler(cruNum = this.curNum - 1) {
    this._callHandler(cruNum)
  }

  play() {
    const now = +new Date();
    this.seekAndPlay((this.pauseStamp || now) - (this.startStamp || now), true)
    this.pauseStamp = 0
  }

  pause() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.pauseStamp = +new Date()
    this.state = STATE_PAUSE

  }

  togglePlay() {
    if (this.state === STATE_PLAYING) {
      this.pause()
    } else {
      this.play()
    }
  }

  seek(startTime, skipLast = false) {
    this.curNum = this._findCurNum(startTime)
    this.startStamp = +new Date() - startTime

    if (!skipLast) {
      this._callHandler(this.curNum - 1)
    }
  }

  seekAndPlay(startTime = 0, skipLast = false) {
    if (!this.lines.length) {
      return
    }
    this.seek(startTime, skipLast)

    if (this.curNum < this.lines.length) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this._playRest()
    }
    this.state = STATE_PLAYING
  }

  destroy() {
    this.pause()
    this.lrc = ''
    this.tags = {}
    this.lines = []
  }
}
