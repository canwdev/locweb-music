<template>
  <div class="music-detail">
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
        <div v-show="isShowDetail" class="detail-content bg-glass-black">
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
              style="flex: 1; overflow: hidden"
              v-show="currentDetailTab === DetailTabEnum.LYRIC"
          >

            <div v-if="lyricObj && lyricObj.lines" class="lrc-main">
              <button class="btn-no-style lyric-lock" title="Lock Lyric" @click="isLyricLock = !isLyricLock">
                <i class="material-icons">
                  {{ isLyricLock ? 'lock' : 'lock_open' }}
                </i>
              </button>

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


    <div
        class="titles-wrap"
        :class="{opacity: isShowDetail}"
        @click="isShowDetail = !isShowDetail"
    >
      <div class="title">{{ musicItem.titleDisplay }}</div>
      <div class="subtitle">{{ musicItem.artist }}</div>
      <div class="subtitle">{{ musicItem.album }}</div>
    </div>
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
    CoverDisplay
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

    const musicItem = computed((): MusicItem => {
      return store.getters.musicItem
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

    const changeCurrentTime = (newTime) => {
      if (lyricObj.value) {
        lyricObj.value.seek(newTime * 1000)
      }
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
    }
  }
})
</script>

<style lang="scss" scoped>
.music-detail {
  width: 300px;
  text-align: center;
  user-select: text;
  padding: 10px;

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

  .cover-wrap {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 0 auto;
    border-radius: $generic-border-radius;
    overflow: hidden;
    box-shadow: 0 0 1px 1px rgba(255, 255, 255, .5);

    @media screen and (max-width: $mobile_min_width) {
      width: 95%;
      height: 270px;
    }

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
    background: rgba(0, 0, 0, 0.4);
    border-radius: inherit;

    .tab-wrap {
      display: flex;
      font-size: 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);

      button {
        flex: 1;
        opacity: .3;
        padding: 10px 0;
        font-weight: bold;

        &.active {
          opacity: 1;
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

    .lrc-main {
      height: 100%;
      position: relative;

      .lyric-lock {
        position: absolute;
        top: 5px;
        left: 5px;
        font-size: 16px;
        opacity: .6;

        i {
          font-size: inherit;
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
          font-size: 14px;
          margin: 10px 0 10px 0;
          text-align: center;
          line-height: 1.3;
          opacity: .7;
          transition: all .3s;

          &.active {
            opacity: 1;
            font-weight: bold;
            font-size: 16px;
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
