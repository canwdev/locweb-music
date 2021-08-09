<template>
  <div class="download-view">
    <Loading
        absolute
        :visible="isLoading"
    />
    <div class="music-download-wrap">
      <div class="wrap-inner-box">
        <div class="main-title">
          {{ $t('msg.netease-music-down') }}
        </div>
        <form @submit.prevent="handleSearch" class="search-wrap">
          <input v-model="searchText" required class="input-styled search-input" type="text" :placeholder="$t('msg.netease-music-search-placeholder')">
          <button class="search-submit btn-styled" type="submit">{{ $t('search') }}</button>
        </form>
        <div class="search-result">
          <div v-if="resultList.length" class="result-list">
            <div
                v-for="(item, index) in resultList"
                :key="index"
                class="list-item"
            >
              <div class="_title">{{ item.name }}</div>
              <div class="_content">
                <div v-if="item.alias.length > 0" class="content-row ">
                  <strong>{{ $t('alias') }}</strong> <span class="_pink">{{ item.alias.join(' / ') }}</span>
                </div>

                <div class="content-row">
                  <strong>{{ $t('artists') }}</strong> {{ formatArtist(item.artists) }}
                </div>

                <div class="content-row">
                  <strong>{{ $t('album') }}</strong> {{ item.album.name }}
                </div>

                <div class="content-row type-2">
                  <div class="content-col">
                    <strong>{{ $t('duration') }}</strong> {{ formatTimeHMS(item.duration / 1000) }}
                  </div>
                  <div class="content-col">
                    <strong>ID</strong> {{ item.id }}
                  </div>
                </div>

                <div class="content-row type-3">
                  <button @click="playMusic(item)" class="content-col btn-styled">
                    {{ $t('play') }}
                  </button>
                  <button @click="handleDownMusic(item, true)" class="content-col btn-styled">
                    {{ $t('msg.direct-open') }}
                  </button>
                  <button @click="handleDownMusic(item, false)" class="content-col btn-styled">
                    {{ $t('msg.download-with-meta') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <NoData v-else :text="$t('msg.kong-kong-ru-ye')"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref
} from 'vue';
import {useI18n} from "vue-i18n";
import NoData from "../NoData.vue";
import {
  searchMusic,
  checkMusic,
  getMusicData,
  getSongDetail
} from "@/api/ncm";
import Loading from '@/components/Loading.vue'
import {formatTimeHMS} from "@/utils";
import axios from "axios";
import { saveAs } from 'file-saver';
import ID3Writer from 'browser-id3-writer';
import store from "@/store";
import bus, {ACTION_PLAY_START} from "@/utils/bus";
import {MusicItem} from "@/enum";

export default defineComponent({
  name: "DownloadView",
  components: {
    NoData,
    Loading
  },
  setup() {
    const {t} = useI18n()
    const searchText = ref('')
    const resultList = ref([])
    const isLoading = ref(false)

    const handleSearch = async () => {
      try {
        isLoading.value = true

        const {result} = await searchMusic({
          keywords: searchText.value,
          // limit: 20
        })
        // console.log(result)
        resultList.value = result.songs
      } finally {
        isLoading.value = false
      }
    }

    const formatArtist = (arr, separator = ' / ') => {
      const nameArr = arr.map(v => {
        return v.name
      })

      return nameArr.join(separator)
    }

    /**
     * 填充ID3标签，并下载音乐
     */
    const downloadMusic = async (url, music) => {
      const id = music.id
      const saveFileName = formatArtist(music.artists, ', ')
          + ' - ' + music.name + '.mp3'

      try {
        isLoading.value = true

        const musicDetail = await getSongDetail({
          ids: id
        })
        const detail = musicDetail.songs[0]
        console.log(detail)

        const musicRes = await axios.get(url, {
          responseType: 'arraybuffer'
        })
        const arrayBuffer = musicRes.data

        const writer = new ID3Writer(arrayBuffer);
        writer.setFrame('TIT2', detail.name)  // song title
            .setFrame('TPE1', formatArtist(music.artists, ';').split(';')) // song artists
            .setFrame('TALB', detail.al.name) // album title
            .setFrame('TYER', new Date(detail.publishTime).getFullYear()) // album release year
            .setFrame('TRCK', detail.no)   // song number in album
            .setFrame('TPOS', detail.cd)   // album disc number
            .setFrame('TCON', [])   // song genres

        if (detail.al.picUrl) {
          // 获取封面图
          const coverRes = await axios.get(detail.al.picUrl, {
            responseType: 'arraybuffer'
          })
          const coverArrayBuffer = coverRes.data
          writer.setFrame('APIC', {
            type: 3,
            data: coverArrayBuffer,
            description: ''
          })  // attached picture
        }

        writer.addTag();

        // const taggedSongBuffer = writer.arrayBuffer;
        const blob = writer.getBlob();
        // const newUrl = writer.getURL();

        saveAs(blob, saveFileName)
      } catch (err) {
        console.error(err)
        window.$notify.error(err.message)
      } finally {
        isLoading.value = false
      }
    }

    const getMusicUrl = async (music, direct = false) => {
      try {
        isLoading.value = true
        const id = music.id

        const musicAvailableRes = await checkMusic({
          id
        })
        const params = direct ?
            {id} : // 最高音质，可能是 FLAC
            {// 最高320kbps MP3
              id, br: '320000'
            }

        const musicUrlRes = await getMusicData(params)

        const available = musicAvailableRes
        const musicUrl = musicUrlRes.data[0]
        console.log({
          available,
          musicUrl
        })

        if (!available.success) {
          window.$notify.error(available.message)
          throw new Error(available.message)
        }
        if (!musicUrl.url) {
          // 版权限制，无法下载
          const errMsg = t('msg.copyright-restrictions')
          window.$notify.error(errMsg)
          throw new Error(errMsg)
        }

        return musicUrl.url


      } catch (err) {
        console.error(err)
        window.$notify.error(err.message)
      } finally {
        isLoading.value = false
      }
    }

    const handleDownMusic = async (music, direct) => {
      const url = await getMusicUrl(music, direct)
      // 直接打开
      if (direct) {
        window.open(url)
        return
      }
      await downloadMusic(url, music)
    }

    const playMusic = async (item) => {
      const url = await getMusicUrl(item, true)
      item = new MusicItem({
        id: item.id,
        album: item.album.name,
        artists: item.artists.map(v => {
          return v.name
        }),
        filename: item.name,
        title: item.name,
        src: url,
        isOutSource: true
      })
      const list = [item]
      store.commit('setPlayingList', list)
      bus.emit(ACTION_PLAY_START, {list, item})
    }

    return {
      formatTimeHMS,
      searchText,
      resultList,
      isLoading,
      handleSearch,
      formatArtist,
      getMusicUrl,
      playMusic,
      handleDownMusic
    }
  }
})
</script>

<style lang="scss" scoped>
@media screen and (min-width: 425px) {
  .music-download-wrap {
    width: 425px;
    position: relative;
    margin: 0 auto;
  }
  .music-download-wrap::before {
    content: " ";
    display: block;
    padding-bottom: 198%;

  }
  .music-download-wrap::after {
    content: " ";
    display: block;
    background: url("~@/assets/images/hardware_faceid_silver_portrait_large.png") no-repeat center/contain;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    pointer-events: none;
  }

  .music-download-wrap .wrap-inner-box {
    position: absolute;
    top: 36px;
    left: 35px;
    right: 35px;
    bottom: 34px;
    box-shadow: 0 0px 2px rgba(0, 0, 0, 0.49);
    border-radius: 5px;
    overflow: auto;
  }
  .music-download-wrap .wrap-inner-box:before {
    content: " ";
    display: block;
    height: 29px;
    width: 100%;
    background: $primary;
  }

}

.wrap-inner-box {
  display: flex;
  flex-direction: column;
}

.download-view {
  height: 100%;
  width: 100%;
  overflow: auto;

  .main-title {
    background: linear-gradient(
            180deg, $primary 0, $primary);
    color: white;
    line-height: 46px;
    text-align: center;
  }

  .search-wrap {
    display: flex;
    padding: 10px 16px;
    border-top: $layout-border;
    border-bottom: $layout-border;

    .input-styled {
      flex: 1;
    }

    .search-submit {
      margin-left: 10px;
    }
  }

  .search-result {
    flex: 1;
    overflow: auto;

    .result-list {
      .list-item {
        border-radius: $generic-border-radius;
        border: $layout-border;
        margin: 5px 5px;
        overflow: hidden;

        ._title {
          background: $border-color;
          padding: 10px 15px;
        }

        ._content {
          padding: 15px 15px;

          .content-row {
            ._pink {
              color: $pink;
            }

            & + .content-row {
              margin-top: 10px;
            }

            &.type-2 {
              display: flex;
              justify-content: space-between;

              .content-col {
                width: 49%;
              }
            }

            &.type-3 {
              display: flex;
              justify-content: space-between;

              .content-col {
                width: 32%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
