<template>
  <div class="music-detail">

    <AutoRatioBox class="cover-wrap-box">
      <div class="cover-wrap">
        <CoverDisplay
          class="big-cover"
          :src="musicItem.cover"
          :is-rotating="false"
          :is-rounded="false"
          :is-show-icon="!isShowDetail"
          @click.native="isShowDetail = true"
        />
        <transition name="fade">
          <div v-show="isShowDetail" class="detail-content bg-dark">
            <div class="tab-wrap">
              <TkButton
                v-for="item in detailTabList"
                :key="item.value"
                size="no-style"
                :class="{active: currentDetailTab === item.value}"
                @click="currentDetailTab = item.value"
              >
                {{ item.label }}
              </TkButton>
            </div>

            <div
              v-show="currentDetailTab === DetailTabEnum.LYRIC"
              class="lyric-content"
            >
              <div class="lyric-lock">
                <TkButton size="no-style" :title="$t('search-lyric')" @click="isShowLyricSearch = true">
                  <i class="material-icons">search</i>
                </TkButton>

                <TkButton size="no-style" :title="$t('lock-lyric')" @click="isLyricLock = !isLyricLock">
                  <i class="material-icons">
                    {{ isLyricLock ? 'lock' : 'lock_open' }}
                  </i>
                </TkButton>
              </div>

              <div v-if="lyricObj && lyricObj.lines" class="lrc-main" :class="{unlocked: !isLyricLock}">
                <div class="lrc-scroll-wrap">
                  <p
                    v-for="(line, index) in lyricObj.lines"
                    :key="index"
                    :class="{active: lyricCurrentLine===index}"
                    :data-index="index"
                  >{{ line.txt }}
                  </p>
                </div>

              </div>
              <div v-else class="lrc-main no-lyric" @click="isShowDetail = false">
                {{ $t('msg.no-lyric') }}
              </div>
            </div>
            <textarea
              v-show="currentDetailTab === DetailTabEnum.METADATA"
              class="metadata"
              cols="30"
              rows="15"
              readonly
              :value="JSON.stringify(musicItem.metadata, null, 2)"
              :placeholder="$t('msg.no-data')"
            ></textarea>

          </div>
        </transition>
      </div>
    </AutoRatioBox>

    <div
      class="below-wrap"
    >
      <div
        class="titles-wrap"
        :class="{opacity: isShowDetail}"
        @click="isShowDetail = !isShowDetail"
      >
        <div class="title">{{ musicItem.titleDisplay }}</div>
        <div class="subtitle">{{ musicItem.artist }}</div>
        <div class="subtitle">{{ musicItem.album }}</div>
      </div>

      <div v-if="!isDisabled" class="actions-wrap">

        <TkButton flat round @click="jumpBackward">
          <i class="material-icons">replay_5</i>
        </TkButton>

        <TkButton
          flat
          round
          :title="$t('playback-speed')"
          @click="showPlaybackSpeedConfig"
        >
          <i class="material-icons">speed</i>
        </TkButton>
        <TkButton
          flat
          round
          :class="{active: stopCountdown}"
          :title="$t('countdown')"
          @click="showStopCountdownConfig"
        >
          <i class="material-icons">timer</i>
        </TkButton>
        <TkButton flat round @click="jumpForward">
          <i class="material-icons">forward_5</i>
        </TkButton>

      </div>
    </div>

    <TkModalDialog
      v-model="isShowLyricSearch"
      fixed
      show-close
    >
      <LyricSearch
        :search="musicItem.filenameDisplay"
        :current-lyric="musicItem.lyric"
        @saveLyric="handleSaveLyric"
      />
    </TkModalDialog>
  </div>
</template>

<script>
import CoverDisplay from '@/components/CoverDisplay.vue'
import bus, {
  ACTION_CHANGE_CURRENT_TIME,
  ACTION_CHANGE_SPEED,
  ACTION_TOGGLE_PLAY
} from '@/utils/bus'
import LyricSearch from '@/components/LyricSearch.vue'
import {
  saveLyric
} from '@/api/music'
import {mapState} from 'vuex'
import lyricMixin from '@/mixins/lyric'

const DetailTabEnum = {
  LYRIC: 'LYRIC',
  METADATA: 'METADATA',
}

class TimerItem {
  constructor(props) {
    this.timer = props.timer
    this.timeStart = props.timeStart || Date.now()
    this.time = props.time
  }
}

export default {
  name: 'MusicDetail',
  mixins: [lyricMixin],
  components: {
    CoverDisplay,
    LyricSearch,
  },
  props: {
    isParentVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      DetailTabEnum,
      currentDetailTab: DetailTabEnum.LYRIC,
      isShowDetail: false,
      isShowLyricSearch: false,
      currentPlayTime: 0,
      detailTabList: [
        {label: this.$t('lyric'), value: DetailTabEnum.LYRIC},
        {label: this.$t('metadata'), value: DetailTabEnum.METADATA},
      ]
    }
  },
  computed: {
    ...mapState([
      'musicItem',
      'currentTime',
      'playbackRate',
      'playingList',
    ]),
    isDisabled() {
      return this.playingList.length === 0
    },
    stopCountdown: {
      get() {
        return this.$store.state.stopCountdown
      },
      set(val) {
        this.$store.commit('setStopCountdown', val)
      }
    }
  },
  watch: {
    isShowDetail(val) {
      if (val) {
        // console.log('isShowDetail', val)
        this.$nextTick(() => {
          if (this.lyricObj) {
            this.lyricObj.callHandler()
          }
        })
      }
    },
    currentPlayTime(val) {
      if (this.lyricObj) {
        this.lyricObj.seek(val)
      }
    }
  },
  mounted() {
    bus.$on(ACTION_CHANGE_CURRENT_TIME, this.changeCurrentTime)
  },
  beforeDestroy() {
    bus.$off(ACTION_CHANGE_CURRENT_TIME, this.changeCurrentTime)
  },
  methods: {
    changeCurrentTime(nt) {
      this.currentPlayTime = nt * 1000
    },
    async handleSaveLyric(lyric) {
      // console.log(lyric)
      this.isShowLyricSearch = false
      this.musicItem.lyric = lyric
      // fix lyric progress bug
      const curTime = this.currentTime
      bus.$emit(ACTION_CHANGE_CURRENT_TIME, 0)
      setTimeout(() => {
        bus.$emit(ACTION_CHANGE_CURRENT_TIME, curTime)
      }, 200)

      this.isShowDetail = true
      this.currentDetailTab = DetailTabEnum.LYRIC

      const {saveFilename} = await saveLyric({
        filename: this.musicItem.filename,
        lyric
      })

      this.$toast.info(saveFilename)
    },
    checkAllowUpdate() {
      return this.isParentVisible && this.isShowDetail
    },
    showPlaybackSpeedConfig() {
      this.$prompt.create({
        propsData: {
          title: this.$t('playback-speed'),
          input: {
            value: this.playbackRate,
            required: true,
            type: 'number',
            step: '.1'
          }
        },
        parentEl: this.$el.parentNode
      }).onConfirm(async (context) => {
        bus.$emit(ACTION_CHANGE_SPEED, context.inputValue)
      })
    },
    jumpForward() {
      bus.$emit(ACTION_CHANGE_CURRENT_TIME, this.currentTime += 5)
    },
    jumpBackward() {
      bus.$emit(ACTION_CHANGE_CURRENT_TIME, this.currentTime -= 5)
    },
    showStopCountdownConfig() {
      const cleanTimer = () => {
        clearTimeout(this.stopCountdown.timer)
        this.stopCountdown = null
      }

      let content
      let targetTime = 30
      const stopCountdown = this.stopCountdown
      const playText = this.paused ? this.$t('start-play') : this.$t('stop-play')

      if (stopCountdown) {
        targetTime = stopCountdown.timeStart + stopCountdown.time
        targetTime = ((targetTime - Date.now()) / 1000 / 60).toFixed(0)
        content = this.$t('msg.countdown-will', { time: targetTime, playText })
      }
      this.$prompt.create({
        propsData: {
          title: this.$t('msg.set-countdown-text'),
          content,
          input: {
            value: targetTime,
            required: true,
          },
          multipleActions: stopCountdown ? [
            {label: this.$t('clear'), value: 1},
          ] : null
        },
        parentEl: this.$el.parentNode
      }).onConfirm(async (context) => {
        if (stopCountdown) {
          cleanTimer()
        }
        const time = context.inputValue * 60 * 1000
        this.$toast.info({
          message: this.$t('msg.countdown-will', { time: context.inputValue, playText })
        })
        const timer = setTimeout(() => {
          cleanTimer()
          this.$toast.success({
            message: playText,
            center: true
          })
          bus.$emit(ACTION_TOGGLE_PLAY)
        }, time)

        this.stopCountdown = new TimerItem({
          timer,
          time
        })
      }).onAction((context, val) => {
        if (val === 1) {
          cleanTimer()
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.music-detail {
  width: 100%;
  text-align: center;
  user-select: text;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;

  .below-wrap {
    min-height: 100px;
  }

  .titles-wrap {
    &.opacity {
      opacity: .8;
      cursor: pointer;
    }

    .title {
      margin-top: 10px;
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .subtitle {
      font-size: 14px;
      margin-bottom: 5px;
    }
  }

  .actions-wrap {
    user-select: none;
    margin-top: 15px;

    button {
      &.active {
        color: $color-pink;
      }
    }

    button + button {
      margin-left: 10px;
    }
  }

  .cover-wrap-box {
    margin: 0 auto 20px;
    max-width: 500px;

  }

  .cover-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .5);
    overflow: hidden;

    .big-cover {
      width: 100%;
      height: 100%;
      cursor: pointer;
      border-radius: inherit;
      overflow: hidden;
    }

    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
  }

  .detail-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: white;
    background: rgba(0, 0, 0, 0.8);
    border-radius: inherit;

    .tab-wrap {
      display: flex;
      font-size: 12px;

      button {
        flex: 1;
        padding: 10px 0;
        font-weight: bold;
        border-bottom: 3px solid rgba(255, 255, 255, 0.2);
        border-radius: 0;

        &.active {
          color: $primary;
          border-bottom-color: $primary;
        }
      }
    }

    .metadata {
      padding: 5px;
      flex: 1;
      width: 100%;
      font-size: 12px;
      font-family: monospace;
      resize: none;
      box-sizing: border-box;
      background: transparent;
      outline: none;
      border: none;
      color: white;
    }

    .lyric-lock {
      position: absolute;
      bottom: 5px;
      right: 5px;
      font-size: 18px;
      opacity: .6;
      z-index: 10;

      i {
        font-size: inherit;
      }

      button {
        margin-left: 5px;
      }
    }

    .lyric-content {
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    .lrc-main {
      height: 100%;
      position: relative;

      &.unlocked {
        .lrc-scroll-wrap {
          & > p {
            opacity: 1;

            &.active {
              text-decoration: underline;
            }
          }

        }
      }

      .lrc-scroll-wrap {
        height: 100%;
        width: 100%;
        overflow: auto;
        padding: 0 5px;
        box-sizing: border-box;
        scroll-behavior: smooth;

        & > p {
          margin: 10px 0 10px 0;
          text-align: center;
          line-height: 1.3;
          opacity: .6;
          transition: all .3s;

          &.active {
            opacity: 1;
          }
        }
      }

      &.no-lyric {
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        opacity: .5;
      }
    }
  }
}
</style>
