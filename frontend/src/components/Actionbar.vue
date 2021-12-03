<template>
  <div class="actionbar-wrapper">
    <div class="progressbar flex items-center justify-between">
      <span class="time text-overflow">{{ formatTimeHMS(mCurrentTime) }}</span>

      <TkSeekbar
        :max="duration"
        :value="mCurrentTime"
        @input="progressSeeking"
        @change="progressChange"
      />

      <span class="time text-overflow">{{ formatTimeHMS(duration) }}</span>
    </div>
    <div class="actionbar flex items-center">
      <ButtonCover
        :src="musicItem.cover"
        icon-name="audiotrack"
        @click.native="isShowDetail = !isShowDetail"
      >
      </ButtonCover>
      <TkButton
        size="no-style"
        class="btn-song-info"
        @click="showDetailDialog"
      >
        <span class="title text-overflow">{{ musicItem.titleDisplay }}</span>
        <span v-show="musicItem.artist" class="artist text-overflow">{{ musicItem.artist }}</span>
        <span v-show="musicItem.album" class="album text-overflow">{{ musicItem.album }}</span>
      </TkButton>
      <div class="buttons-scroll flex items-center">
        <TkButton
          size="no-style"
          :disabled="isDisabled"
          class="btn-action"
          :title="$t('previous')"
          @click="previous"
        >
          <i class="material-icons">skip_previous</i>
        </TkButton>

        <TkButton
          size="no-style"
          :disabled="isDisabled"
          class="btn-action"
          :title="paused ? $t('play') : $t('pause')"
          @click="togglePlay"
        >
          <i v-show="paused" class="material-icons">play_arrow</i>
          <i v-show="!paused" class="material-icons">pause</i>
        </TkButton>

        <TkButton
          size="no-style"
          :disabled="isDisabled"
          class="btn-action"
          :title="$t('next')"
          @click="next"
        >
          <i class="material-icons">skip_next</i>
        </TkButton>

        <TkButton
          size="no-style"
          :class="{active: isShowPlayingList}"
          class="btn-action"
          @click="isShowPlayingList = !isShowPlayingList"
        >
          <i class="material-icons">playlist_play</i>
        </TkButton>

        <TkButton
          size="no-style"
          class="btn-action"
          :title="currentLoopMode.label"
          @click="switchLoopMode"
        >
          <i class="material-icons" :class="currentLoopMode.className">{{ currentLoopMode.icon }}</i>
        </TkButton>

        <TkButton
          size="no-style"
          class="btn-action"
          :title="$t('volume')"
          @click="isShowVolumeSlider = !isShowVolumeSlider"
        >
          <i class="material-icons">{{ volumeIcon }}</i>
        </TkButton>
      </div>
    </div>

    <!--Music Detail Dialog-->
    <TkModalDialog
      v-model="isShowDetail"
      fixed
      class="music-detail-dialog"
      show-close
      no-radius
      unlimited-size
    >
      <div
        class="detail-bg-layer"
        :class="{blur: detailBgStyle, 'light-theme': !isDarkTheme}"
        :style="detailBgStyle"
      >
        <MusicDetail
          :is-parent-visible="isShowDetail"
        />
      </div>
    </TkModalDialog>

    <!-- Playing List -->
    <TkModalDialog
      v-model="isShowPlayingList"
      fixed
      show-close
      class="playing-list-dialog"
      transition-name="slide-bottom"
    >
      <PlayingList ref="playingListRef"/>

    </TkModalDialog>

    <TkModalDialog
      v-model="isShowVolumeSlider"
      fixed
    >
      <div
        class="volume-slider-wrap"
        @click.stop
      >
        <div class="tip">{{ $t('volume') }}</div>
        <TkSeekbar
          vertical
          :value="audioVolume"
          @input="volumeSeeking"
          @change="volumeChange"
        />
        <div class="tip">{{ audioVolume }}%</div>
      </div>
    </TkModalDialog>

    <TreePlaylistChooser
      :visible.sync="isShowChoosePlaylist"
      :title="$t('msg.add-to-playlist')"
      :title-icon="`playlist_add`"
      @submit="handleChoosePlaylist"
    />

    <TkModalDialog
      v-model="isLoading"
      fixed
      unlimited-size
      persistent
    >
      <TkCard>
        <TkLoading :visible="isLoading"/>
      </TkCard>
    </TkModalDialog>
  </div>
</template>

<script>
import {LoopModeType,} from '@/enum'
import bus, {
  ACTION_CHANGE_CURRENT_TIME,
  ACTION_NEXT, ACTION_PREV,
  ACTION_TOGGLE_PLAY,
  ACTION_ADD_PLAYLIST, ACTION_DOWNLOAD_FILE, ACTION_ADD_LIST_PLAY_NEXT,
} from '@/utils/bus'
import {downLoadFile, formatTimeHMS} from '@/utils'
import ButtonCover from '@/components/ButtonCover.vue'
import MusicDetail from '@/components/MusicDetail.vue'
import hotkeys from 'hotkeys-js'
import {mapGetters, mapState} from 'vuex'
import audioVolumeMixin from '@/mixins/audio-volume'
import PlayingList from '@/components/PlayingList/index.vue'
import TreePlaylistChooser from '@/components/TreePlaylistChooser'
import {addPlaylistMusic} from '@/api/playlist'
import {getDownloadUrl} from '@/api/music'

const loopModeList = [
  LoopModeType.LOOP_SEQUENCE,
  LoopModeType.LOOP_SINGLE,
  LoopModeType.SHUFFLE,
  LoopModeType.LOOP_REVERSE,
  LoopModeType.NONE,
]
const keySpace = 'space'
const keyPrevious = 'left,pageup,k,l'
const keyNext = 'right,pagedown,h,j'
const keyUp = 'up'
const keyDown = 'down'

export default {
  name: 'Actionbar',
  mixins: [audioVolumeMixin],
  components: {
    ButtonCover,
    MusicDetail,
    PlayingList,
    TreePlaylistChooser,
  },
  data() {
    return {
      mCurrentTime: 0,
      isSeeking: false,
      isShowDetail: false,
      isShowPlayingList: false,
      isShowVolumeSlider: false,
      isShowChoosePlaylist: false,
      currentAddItems: null,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'isDarkTheme'
    ]),
    ...mapState([
      'currentTime',
      'duration',
      'musicItem',
      'paused',
      'playingList',
      'playingIndex',
    ]),
    isDisabled() {
      return this.playingList.length === 0
    },
    detailBgStyle() {
      if (this.musicItem.cover) {
        return {
          backgroundImage: `url(${this.musicItem.cover})`
        }
      }
      return null
    },
    loopMode: {
      get() {
        return this.$store.getters.loopMode
      },
      set(val) {
        this.$store.commit('setLoopMode', val)
      }
    },
    currentLoopMode() {
      const loopModeMap = {
        [LoopModeType.NONE]: {
          icon: 'arrow_forward',
          label: this.$t('msg.play-in-order'),
        },
        [LoopModeType.SHUFFLE]: {
          icon: 'shuffle',
          label: this.$t('shuffle'),
        },
        [LoopModeType.LOOP_SEQUENCE]: {
          icon: 'repeat',
          label: this.$t('msg.sequential-loop'),
        },
        [LoopModeType.LOOP_REVERSE]: {
          icon: 'repeat', className: 'reverse-x',
          label: this.$t('msg.reverse-loop'),
        },
        [LoopModeType.LOOP_SINGLE]: {
          icon: 'repeat_one',
          label: this.$t('msg.single-cycle'),
        },
      }
      return loopModeMap[this.loopMode]
    }
  },
  watch: {
    currentTime(val) {
      if (!this.isSeeking) {
        this.mCurrentTime = Number(val)
      }
    },
    isShowPlayingList(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.playingListRef.locateItem()
        })
      }
    },
    isShowDetail(val) {
      if (val) {
        this.isShowPlayingList = false
      }
    }
  },
  mounted() {
    hotkeys(keySpace, this.togglePlay)
    hotkeys(keyPrevious, this.previous)
    hotkeys(keyNext, this.next)
    hotkeys('x', this.switchLoopMode)

    hotkeys(keyUp, this.volumeUpFn)
    hotkeys(keyDown, this.volumeDownFn)

    bus.$on(ACTION_ADD_PLAYLIST, this.handleAddPlaylist)
    bus.$on(ACTION_DOWNLOAD_FILE, this.actionDownloadFile)
    bus.$on(ACTION_ADD_LIST_PLAY_NEXT, this.addListPlayNext)
  },
  beforeDestroy() {
    hotkeys.unbind(keySpace, this.togglePlay)
    hotkeys.unbind(keyPrevious, this.previous)
    hotkeys.unbind(keyNext, this.next)
    hotkeys.unbind('x', this.switchLoopMode)

    hotkeys.unbind(keyUp, this.volumeUpFn)
    hotkeys.unbind(keyDown, this.volumeDownFn)

    bus.$off(ACTION_ADD_PLAYLIST, this.handleAddPlaylist)
    bus.$off(ACTION_DOWNLOAD_FILE, this.actionDownloadFile)
    bus.$off(ACTION_ADD_LIST_PLAY_NEXT, this.addListPlayNext)
  },
  methods: {
    formatTimeHMS,
    volumeUpFn(e) {
      e.preventDefault()
      this.volumeUp()
    },
    volumeDownFn(e) {
      e.preventDefault()
      this.volumeDown()
    },
    previous() {
      bus.$emit(ACTION_PREV)
    },
    next() {
      bus.$emit(ACTION_NEXT)
    },
    togglePlay(e) {
      e.preventDefault()
      bus.$emit(ACTION_TOGGLE_PLAY)
    },
    switchLoopMode() {
      let index = loopModeList.findIndex(i => i === this.loopMode)
      ++index
      if (index > loopModeList.length - 1) {
        index = 0
      }
      this.loopMode = loopModeList[index]
      // @ts-ignore
      this.$toast.info(this.currentLoopMode.label)
    },
    progressSeeking(value) {
      // console.log('progressSeeking', evt.target.value)
      this.isSeeking = true
      this.mCurrentTime = Number(value)
    },
    progressChange(value) {
      value = Number(value)
      // console.log('progressChange', value)

      bus.$emit(ACTION_CHANGE_CURRENT_TIME, value)
      this.isSeeking = false
    },
    showDetailDialog() {
      this.isShowDetail = !this.isShowDetail
      // console.log(musicItem.value)
    },
    handleAddPlaylist(config = {}) {
      const {
        items,
      } = config

      this.currentAddItems = items
      this.isShowChoosePlaylist = true
    },
    handleChoosePlaylist(val) {
      const pid = val.data.id

      const items = this.currentAddItems
      this.currentAddItems = null
      this.addMusicToPlaylist(items, pid)
    },
    async addMusicToPlaylist(items, pid) {
      try {
        this.isLoading = true
        await addPlaylistMusic({
          musics: items.map(item => {
            return {filepath: item.filepath}
          }),
          pid: pid,
        })
        this.$toast.success(this.$t('msg.music-added'))
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    async actionDownloadFile(item) {
      if (!item) return
      try {
        let saveName = item.filename
        if (item.isMigrated) {
          saveName = item.filenameDisplay + '.' + item.fileSuffix
        }
        downLoadFile(getDownloadUrl({
          path: item.path,
          filename: item.filename,
          saveName: saveName
        }))
      } catch (e) {
        console.error(e)
      }
    },
    addListPlayNext(item) {
      this.playingList.splice(this.playingIndex, 0, item)
    }
  }
}
</script>

<style lang="scss" scoped>
.actionbar-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

$bottomZIndex: 2100;

.progressbar {
  height: 25px;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  position: relative;
  z-index: $bottomZIndex;
  background: $color-white;

  .time {
    font-size: 12px;
    width: 62px;
    text-align: center;
  }

}

.actionbar {
  height: 50px;
  user-select: none;
  position: relative;
  z-index: $bottomZIndex;
  background: $color-white;

  button {
    border-radius: 0;
  }

  .btn-cover {
    background-color: $primary;
    border-radius: 0;
  }

  .btn-song-info {
    width: 45%;
    height: 100%;
    border-right: 1px solid $border-color;
    text-align: left;
    padding-left: 5px;
    line-height: 1.1;

    .title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 2px;
    }

    .artist, .album {
      opacity: .8;
      font-size: 10px;
    }

    & > span {
      display: block;
      width: 100%;
    }
  }

  .buttons-scroll {
    overflow: auto;
    height: 100%;
    flex: 1;
    flex-wrap: nowrap;

    & > button {
      height: 100%;
      width: 55px;
      font-size: 28px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      .reverse-x {
        text-shadow: 0 0 5px $color-pink;
        color: $color-pink;
        transform: rotateX(-180deg);
      }

      &.active {
        color: $primary;
      }

      & + button {
        border-left: 1px solid $border-color;
      }
    }
  }
}

.tk-dark-theme {
  .progressbar {
    background: $dark;
  }

  .actionbar {
    background: $dark;
  }
}

.music-detail-dialog {
  align-items: start;

  ::v-deep & > .dialog-main {
    width: 100%;
    height: calc(100% - 75px);
    backdrop-filter: none;

    & > .btn-close {
      top: 10px;
      right: 10px;
    }

    & > .dialog-inner {
    }

    .detail-bg-layer {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;

      &.blur .music-detail {
        background: rgba(28, 28, 28, 0.77);
        backdrop-filter: saturate(180%) blur(20px);
      }

      &.light-theme {
        .music-detail {
          background: rgba(254, 254, 254, 0.77);
        }
      }
    }
  }
}

.playing-list-dialog {
  align-items: flex-end;
  padding-bottom: 75px;
  box-sizing: border-box;

  ::v-deep .playlist-wrap {
    .virtual-scroller {
      padding: 0 10px;
      overflow-y: overlay; // 滚动条覆盖
      box-sizing: border-box;
    }

    .main-list {
      height: 50vh;
      overflow: hidden;

      @media screen and (max-height: $mq_pc_min_height) {
        height: 75vh;
      }
    }

  }
}

.volume-slider-wrap {
  text-align: center;
  width: 80px;
  height: 180px;
  padding: 10px 0 0 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .tip {
    max-width: 100%;
    overflow: hidden;
    font-size: 12px;
    margin: 5px 10px;
  }
}
</style>
