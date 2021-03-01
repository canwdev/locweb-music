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

interface LineTimeObj {
  time: number;
  txt: string;
}

export default class LyricParser {
  lrc: string;
  tags: Record<string, any>;
  lines: Array<LineTimeObj>;
  handler: Function | undefined;
  state: number;
  curLine: number;
  curNum: number;
  startStamp: number;
  timer: NodeJS.Timeout | undefined;
  pauseStamp: number;

  constructor(lrc, handler?: Function) {
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

  play(startTime = 0, skipLast = false) {
    if (!this.lines.length) {
      return
    }
    this.state = STATE_PLAYING

    this.curNum = this._findCurNum(startTime)
    this.startStamp = +new Date() - startTime

    if (!skipLast) {
      this._callHandler(this.curNum - 1)
    }

    if (this.curNum < this.lines.length) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this._playRest()
    }
  }

  // todo refactor
  togglePlay() {
    const now = +new Date();
    if (this.state === STATE_PLAYING) {
      this.stop()
      this.pauseStamp = now
    } else {
      this.state = STATE_PLAYING
      this.play((this.pauseStamp || now) - (this.startStamp || now), true)
      this.pauseStamp = 0
    }
  }

  stop() {
    this.state = STATE_PAUSE
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  // todo bugfix
  seek(offset) {
    this.play(offset)
  }
}
