<template>
  <div class="music-detail">

    <AutoRatioBox class="cover-wrap-box" :class="{'dark': isDarkTheme}">
      <div class="cover-wrap">
        <CoverDisplay
            class="big-cover"
            :src="musicItem.cover"
            :is-rotating="false"
            :is-rounded="false"
            :is-show-icon="!isShowDetail"
            @click="isShowDetail = true"
        />
        <transition name="fade">
          <div v-show="isShowDetail" class="detail-content bg-dark">
            <div class="tab-wrap">
              <button
                  v-for="item in detailTabList"
                  :key="item.value"
                  class="btn-no-style"
                  :class="{active: currentDetailTab === item.value}"
                  @click="currentDetailTab = item.value"
              >
                {{ item.label }}
              </button>
            </div>

            <div
                class="lyric-content"
                v-show="currentDetailTab === DetailTabEnum.LYRIC"
            >
              <div class="lyric-lock">
                <button class="btn-no-style" title="Search Lyric" @click="isShowLyricSearch = true">
                  <i class="material-icons">search</i>
                </button>

                <button class="btn-no-style" title="Lock Lyric" @click="isLyricLock = !isLyricLock">
                  <i class="material-icons">
                    {{ isLyricLock ? 'lock' : 'lock_open' }}
                  </i>
                </button>
              </div>


              <div v-if="lyricObj && lyricObj.lines" class="lrc-main" :class="{unlocked: !isLyricLock}">
                <div class="lrc-scroll-wrap">
                  <p
                      v-for="(line, index) in lyricObj.lines"
                      :class="{active: lyricCurrentLine===index}"
                      :key="index"
                      :data-index="index"
                  >{{ line.txt }}
                  </p>
                </div>

              </div>
              <div v-else class="lrc-main no-lyric" @click="isShowDetail = false">
                没有歌词，请欣赏
              </div>
            </div>
            <textarea
                v-show="currentDetailTab === DetailTabEnum.METADATA"
                class="metadata" cols="30" rows="15" readonly
                :value="JSON.stringify(musicItem.metadata, null, 2)"></textarea>
          </div>
        </transition>
      </div>
    </AutoRatioBox>


    <div
        class="titles-wrap"
        :class="{opacity: isShowDetail}"
        @click="isShowDetail = !isShowDetail"
    >
      <div class="title">{{ musicItem.titleDisplay }}</div>
      <div class="subtitle">{{ musicItem.artist }}</div>
      <div class="subtitle">{{ musicItem.album }}</div>
    </div>

    <ModalDialog
        fixed
        v-model:visible="isShowLyricSearch"
        :dark="isDarkTheme"
        is-show-close
    >
      <LyricSearch
          :search="musicItem.filenameDisplay"
          :current-lyric="musicItem.lyric"
          @saveLyric="handleSaveLyric"
      />
    </ModalDialog>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch, nextTick, onMounted, onBeforeUnmount, toRefs} from 'vue';
import CoverDisplay from "@/components/CoverDisplay.vue"
import {MusicItem} from "@/enum";
import store from "@/store";
import useLyricObj from "@/composables/useLyricObj";
import bus, {
  ACTION_CHANGE_CURRENT_TIME
} from "@/utils/bus";
import LyricSearch from "@/components/LyricSearch.vue";
import ModalDialog from "@/components/ModalDialog.vue";
import {
  saveLyric
} from "@/api/music";
import AutoRatioBox from '@/components/AutoRatioBox.vue'

const DetailTabEnum = {
  LYRIC: 'LYRIC',
  METADATA: 'METADATA',
}
const detailTabList = [
  {label: 'Lyric', value: DetailTabEnum.LYRIC},
  {label: 'Metadata', value: DetailTabEnum.METADATA},
]

export default defineComponent({
  name: 'MusicDetail',
  components: {
    CoverDisplay,
    LyricSearch,
    ModalDialog,
    AutoRatioBox
  },
  props: {
    isParentVisible: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const {isParentVisible} = toRefs(props)
    const currentDetailTab = ref(DetailTabEnum.LYRIC)
    const isShowDetail = ref(false)
    const isShowLyricSearch = ref(false)
    const currentPlayTime = ref(0) // ms

    const musicItem = computed((): MusicItem => {
      return store.state.musicItem
    })
    const currentTime = computed(() => {
      return store.state.currentTime
    })

    const {
      lyricObj,
      lyricCurrentLine,
      isLyricLock,
    } = useLyricObj({
      checkAllowUpdate() {
        return isParentVisible.value && isShowDetail.value
      }
    })
    watch(isShowDetail, (val) => {
      if (val) {
        // console.log('isShowDetail', val)
        nextTick(() => {
          if (lyricObj.value) {
            lyricObj.value.callHandler()
          }
        })
      }
    })
    watch(currentPlayTime, (val, oldVal) => {
      // console.log('currentPlayTime', val, oldVal)
      if (lyricObj.value) {
        lyricObj.value.seek(val)
      }
    })

    const changeCurrentTime = (newTime) => {
      currentPlayTime.value = newTime * 1000
    }

    const handleSaveLyric = async (lyric) => {
      // console.log(lyric)
      isShowLyricSearch.value = false
      musicItem.value.lyric = lyric
      // fix lyric progress bug
      const curTime = currentTime.value
      bus.emit(ACTION_CHANGE_CURRENT_TIME, 0)
      setTimeout(() => {
        bus.emit(ACTION_CHANGE_CURRENT_TIME, curTime)
      }, 200)

      isShowDetail.value = true
      currentDetailTab.value = DetailTabEnum.LYRIC



      const {saveFilename} = await saveLyric({
        filename: musicItem.value.filename,
        lyric
      })

      window.$notify.info(saveFilename, {
        position: 'top',
      })
    }

    onMounted(() => {
      bus.on(ACTION_CHANGE_CURRENT_TIME, changeCurrentTime)
    })
    onBeforeUnmount(() => {
      bus.off(ACTION_CHANGE_CURRENT_TIME, changeCurrentTime)
    })

    return {
      DetailTabEnum,
      detailTabList,
      musicItem,
      currentDetailTab,
      lyricObj,
      lyricCurrentLine,
      isLyricLock,
      isShowDetail,
      isShowLyricSearch,
      handleSaveLyric,
      isDarkTheme: computed(() => store.getters.isDarkTheme),
    }
  }
})
</script>

<style lang="scss" scoped>
.music-detail {
  width: 100%;
  text-align: center;
  user-select: text;
  padding: 10px;
  box-sizing: border-box;

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

  .cover-wrap-box {
    margin: 0 auto 20px;
    max-width: 500px;
    border-radius: $generic-border-radius;
    box-shadow: 0 2px 5px rgba(0, 0, 0, .5);

    &.dark {
      box-shadow: 0 0 8px 2px $primary;
    }
  }

  .cover-wrap {
    position: relative;
    width: 100%;
    height: 100%;

    .big-cover {
      width: 100%;
      height: 100%;
      cursor: pointer;
      border-radius: inherit;
      overflow: hidden;
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
      font-size: 14px;

      button {
        flex: 1;
        padding: 10px 0;
        font-weight: bold;
        border-bottom: 2px solid rgba(255, 255, 255, 0.2);

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
