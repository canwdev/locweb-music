<template>
  <div class="download-view">

    <div class="music-download">
      <div class="music-download__header">
        <div class="main-title">{{ $t('msg.netease-music-down') }}</div>
        <form class="search-wrap" @submit.prevent="handleSearch">
          <TkInput
            v-model="searchText"
            required
            class=" search-input"
            type="text"
            :placeholder="$t('msg.netease-music-search-placeholder')"
          />
          <TkButton class="search-submit " type="submit">{{ $t('search') }}</TkButton>
        </form>
      </div>

      <div class="music-download__content">
        <TkLoading
          absolute
          :visible="isLoading"
        />

        <div v-if="resultList.length" class="result-list">
          <div
            v-for="(item, index) in resultList"
            :key="index"
            class="list-item"
          >
            <div class="_title">{{ item.name }}</div>
            <div class="_content">
              <div v-if="item.alias.length > 0" class="content-row">
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
                <TkButton class="content-col " @click="playMusic(item)">
                  {{ $t('play') }}
                </TkButton>
                <TkButton class="content-col " @click="handleDownMusic(item, true)">
                  {{ $t('msg.direct-open') }}
                </TkButton>
                <TkButton class="content-col " @click="handleDownMusic(item, false)">
                  {{ $t('msg.download-with-meta') }}
                </TkButton>
              </div>
            </div>
          </div>
        </div>
        <TkEmpty v-else :text="$t('msg.kong-kong-ru-ye')"/>
      </div>
    </div>
  </div>
</template>

<script>
import {
  searchMusic,
  checkMusic,
  getMusicData,
  getSongDetail
} from '@/api/ncm'

import {formatTimeHMS} from '@/utils'
import axios from 'axios'
import {saveAs} from 'file-saver'
import ID3Writer from 'browser-id3-writer'
import bus, {ACTION_PLAY_START} from '@/utils/bus'
import {MusicItem} from '@/enum'
import {openInBrowser} from '@/utils/client'

export default {
  name: 'DownloadView',
  data() {
    return {
      searchText: '',
      resultList: [],
      isLoading: false,
    }
  },
  methods: {
    formatTimeHMS,
    async handleSearch() {
      try {
        this.isLoading = true

        const {result} = await searchMusic({
          keywords: this.searchText,
          // limit: 20
        })
        // console.log(result)
        this.resultList = result.songs
      } finally {
        this.isLoading = false
      }
    },
    formatArtist(arr, separator = ' / ') {
      const nameArr = arr.map(v => {
        return v.name
      })

      return nameArr.join(separator)
    },
    /**
     * 填充ID3标签，并下载音乐
     */
    async downloadMusic(url, music) {
      const id = music.id
      const saveFileName = this.formatArtist(music.artists, ', ') +
        ' - ' + music.name + '.mp3'

      try {
        this.isLoading = true

        const musicDetail = await getSongDetail({
          ids: id
        })
        const detail = musicDetail.songs[0]
        console.log(detail)

        const musicRes = await axios.get(url, {
          responseType: 'arraybuffer'
        })
        const arrayBuffer = musicRes.data

        const writer = new ID3Writer(arrayBuffer)
        writer.setFrame('TIT2', detail.name) // song title
          .setFrame('TPE1', this.formatArtist(music.artists, ';').split(';')) // song artists
          .setFrame('TALB', detail.al.name) // album title
          .setFrame('TYER', new Date(detail.publishTime).getFullYear()) // album release year
          .setFrame('TRCK', detail.no) // song number in album
          .setFrame('TPOS', detail.cd) // album disc number
          .setFrame('TCON', []) // song genres

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
          }) // attached picture
        }

        writer.addTag()

        // const taggedSongBuffer = writer.arrayBuffer;
        const blob = writer.getBlob()
        // const newUrl = writer.getURL();

        saveAs(blob, saveFileName)
      } catch (err) {
        console.error(err)
        this.$toast.error(err.message)
      } finally {
        this.isLoading = false
      }
    },
    async getMusicUrl(music, direct = false) {
      try {
        this.isLoading = true
        const id = music.id

        const musicAvailableRes = await checkMusic({
          id
        })
        const params = direct
          ? {id} // 最高音质，可能是 FLAC
          : {// 最高320kbps MP3
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
          this.$toast.error(available.message)
          throw new Error(available.message)
        }
        if (!musicUrl.url) {
          // 版权限制，无法下载
          const errMsg = this.$t('msg.copyright-restrictions')
          this.$toast.error(errMsg)
          throw new Error(errMsg)
        }

        return musicUrl.url
      } catch (err) {
        console.error(err)
        this.$toast.error(err.message)
      } finally {
        this.isLoading = false
      }
    },
    async handleDownMusic(music, direct) {
      const url = await this.getMusicUrl(music, direct)
      // 直接打开
      if (direct) {
        openInBrowser(url)
        return
      }
      await this.downloadMusic(url, music)
    },
    async playMusic(item) {
      const url = await this.getMusicUrl(item, true)
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
      this.$store.commit('setPlayingList', list)
      bus.$emit(ACTION_PLAY_START, {list, item})
    }
  },

}
</script>

<style lang="scss" scoped>
.download-view {
  height: 100%;
  width: 100%;
  overflow: auto;
}
.music-download {
  height: 100%;
  width: 100%;
  overflow: hidden;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px $separator-color;
  border-left: 1px solid $border-color;
  border-right: 1px solid $border-color;

  &__header {
    border-bottom: 1px solid $border-color;
    .main-title {
      font-size: 12px;
      line-height: 2;
      text-align: center;
    }
    .search-wrap {
      display: flex;
      padding: 10px 10px;

      input {
        flex: 1;
      }

      .search-submit {
        margin-left: 10px;
      }
    }
  }

  &__content {
    flex: 1;
    overflow: auto;
    position: relative;

    .result-list {
      .list-item {
        border-radius: $border-radius;
        border: $layout-border;
        margin: 10px 10px;
        overflow: hidden;
        transition: box-shadow .3s;

        &:hover {
          box-shadow: 0 0 5px $separator-color;
        }

        ._title {
          background: $border-color;
          padding: 10px 15px;
          font-weight: bold;
        }

        ._content {
          padding: 15px 15px;

          .content-row {
            ._pink {
              color: $color-pink;
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
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
