<template>
  <MainList
    :is-loading="isLoading"
    :list="playingList"
    :active-id="playingId"
    is-play-list
    :is-paused="paused"
    :min-item-size="55"
    :filter-placeholder="$t('filter-by-name')"
    @onItemClick="handleItemClick"
    @onItemAction="handleItemAction"
  >
    <DialogMenu
      :visible.sync="isShowFileMenu"
      :list="fileMenuList"
    />
  </MainList>
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
import {LoopModeType, NavBarIndex} from '@/enum'
import {mapGetters, mapState} from 'vuex'
import DialogMenu from '@/components/DialogMenu.vue'
import dialogMenuMixin from '@/mixins/dialog-menu'

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default {
  name: 'ListPlaying',
  mixins: [dialogMenuMixin],
  components: {
    MainList,
    DialogMenu
  },
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapState([
      'playingList',
      'isRandom',
      'paused',
      'musicItem',
    ]),
    ...mapGetters([
      'loopMode'
    ]),
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
    playMusicFromList(list, item) {
      this.$store.commit('setMusicItem', item)
      this.playingIndex = list.findIndex((val) => {
        return val.filename === item.filename
      })

      this.$nextTick(() => {
        // jump to playing list
        setTimeout(() => {
          this.$store.commit('setNavbarIndex', NavBarIndex.RIGHT)
        }, 30)
        bus.$emit(ACTION_TOGGLE_PLAY) // {isPlay: true}
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
        bus.$emit(ACTION_TOGGLE_PLAY, {isPlay: true})
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
    handlePlayStart(event) {
      const {
        list,
        item
      } = event
      this.playMusicFromList(list, item)
    },
  }
}
</script>

<style scoped>

</style>
