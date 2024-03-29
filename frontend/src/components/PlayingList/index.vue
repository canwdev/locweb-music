<template>
  <div class="playlist-wrap settings-form">
    <div class="settings-title">
      <i class="title-icon material-icons">playlist_play</i>
      <template v-if="playingList.length">
        [{{ playingIndex + 1 }}/{{ playingList.length }}]
      </template>
      正在播放
    </div>
    <MainList
      ref="mainListRef"
      :is-loading="isLoading"
      :list="playingList"
      :active-id="playingId"
      is-play-list
      :is-paused="paused"
      :min-item-size="55"
      allow-sort
      show-btn-menu
      :filter-placeholder="$t('filter-by-name')"
      @onItemClick="handleItemClick"
      @onItemAction="showItemMenu"
      @updateSort="handleUpdateSort"
      @openMenu="showListMenu"
    >
      <template v-slot:actions>
        <TkButton
          size="no-style"
          :disabled="!playingList.length"
          :class="{active: isRandom}"
          :title="$t('random')"
          @click="toggleRandom"
        ><i class="material-icons">casino</i>
        </TkButton>
      </template>
      <ContextMenuCommon
        ref="itemMenuRef"
        :list-fn="getItemMenuList"
        :border-margin="80"
      />

      <ContextMenuCommon
        ref="listMenuRef"
        :list="menuList"
      />
    </MainList>


  </div>
</template>

<script>
import MainList from '@/components/MainList/index.vue'
import bus, {
  ACTION_PLAY_START,
  ACTION_TOGGLE_PLAY,
  ACTION_PREV,
  ACTION_NEXT,
  ACTION_PLAY_ENDED
} from '@/utils/bus'
import {LoopModeType} from '@/enum'
import {mapGetters, mapState} from 'vuex'
import dialogMenuMixin from './dialog-menu'
import ContextMenuCommon from '@/components/ContextMenuCommon'

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default {
  name: 'PlayingList',
  mixins: [dialogMenuMixin],
  components: {
    MainList,
    ContextMenuCommon,
  },
  data() {
    return {
      isLoading: false,
      isPlayEnded: false
    }
  },
  computed: {
    ...mapState([
      'playingList',
      'paused',
      'musicItem',
    ]),
    ...mapGetters([
      'loopMode'
    ]),
    isRandom: {
      get() {
        return this.$store.state.isRandom
      },
      set(val) {
        this.$store.commit('setIsRandom', val)
      }
    },
    playingId() {
      return this.musicItem.id
    },
    playingIndex: {
      get() {
        return this.$store.state.playingIndex
      },
      set(val) {
        this.$store.commit('setPlayingIndex', val)
      }
    }
  },
  mounted() {
    bus.$on(ACTION_PLAY_START, this.handlePlayStart)
    bus.$on(ACTION_PREV, this.playPrev)
    bus.$on(ACTION_NEXT, this.playNext)
    bus.$on(ACTION_PLAY_ENDED, this.handlePlayEnded)
  },
  beforeDestroy() {
    bus.$off(ACTION_PLAY_START, this.handlePlayStart)
    bus.$off(ACTION_PREV, this.playPrev)
    bus.$off(ACTION_NEXT, this.playNext)
    bus.$off(ACTION_PLAY_ENDED, this.handlePlayEnded)
  },
  methods: {
    playMusicFromList(list, item, isPlay) {
      this.$store.commit('setMusicItem', item)
      this.playingIndex = list.findIndex((val) => {
        return val.filename === item.filename
      })

      this.$nextTick(() => {
        bus.$emit(ACTION_TOGGLE_PLAY, {isPlay}) // {isPlay: true}
      })
    },
    handleItemClick(item) {
      if (item.isDirectory) {
        return
      }

      // play a song
      this.playMusicFromList(this.playingList, item)
    },
    playByIndex(index) {
      // console.log('playByIndex', index)
      this.$store.commit('setMusicItem', this.playingList[index])
      this.playingIndex = index
      this.$nextTick(() => {
        if (this.isPlayEnded) {
          bus.$emit(ACTION_TOGGLE_PLAY, {isPlay: true})
          this.isPlayEnded = false
        } else if (this.paused) {
          bus.$emit(ACTION_TOGGLE_PLAY, {isPause: true})
        } else {
          bus.$emit(ACTION_TOGGLE_PLAY, {isPlay: true})
        }
      })
    },
    playPrev() {
      let index = this.playingIndex - 1
      if (index < 0) {
        index = this.playingList.length - 1
      }
      this.playByIndex(index)
    },
    playShuffle() {
      this.playByIndex(getRandomInt(0, this.playingList.length - 1))
    },
    playNext() {
      if (this.loopMode === LoopModeType.SHUFFLE) {
        this.playShuffle()
        return
      }
      let index = this.playingIndex + 1
      if (index > this.playingList.length - 1) {
        if (this.loopMode === LoopModeType.LOOP_SEQUENCE) {
          // loop list from first
          index = 0
        } else {
          // stop at last
          return
        }
      }
      this.playByIndex(index)
    },
    handlePlayEnded() {
      this.isPlayEnded = true
      // console.log('handlePlayEnded', this.loopMode)
      if (this.loopMode === LoopModeType.LOOP_SINGLE) {
        // single loop
        bus.$emit(ACTION_TOGGLE_PLAY, {isPlay: true})
        return
      }
      if (this.loopMode === LoopModeType.LOOP_REVERSE) {
        // reverse play
        this.playPrev()
        return
      }
      if (this.loopMode === LoopModeType.SHUFFLE) {
        this.playShuffle()
        return
      }
      this.playNext()
    },
    handlePlayStart(config) {
      const {
        list,
        item,
        isPlay
      } = config
      this.playMusicFromList(list, item, isPlay)
    },
    toggleRandom() {
      if (this.playingList.length === 0) {
        return
      }
      const flag = !this.isRandom
      if (flag) {
        this.$store.commit('setShuffle')
      } else {
        this.$store.commit('setShuffleRestore')
      }
      this.$toast.info(this.$t('random') + ': ' + (flag ? this.$t('on') : this.$t('off')))
    },
    locateItem() {
      this.$refs.mainListRef.locateItem()
    },
    handleUpdateSort(data) {
      console.log('handleUpdateSort', data)
      const {index, swapIndex} = data
      if (this.playingIndex === index) {
        this.playingIndex = swapIndex
      }
    },
  }
}
</script>

