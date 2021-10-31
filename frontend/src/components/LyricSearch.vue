<template>
  <div class="lyric-search">
    <TkLoading
      absolute
      :visible="isLoading"
    />
    <div v-show="!isDetail" class="search-index">
      <form class="flex items-center search-form" @submit.prevent="handleSearch">
        <TkInput
          v-model="searchText"
          class=""
          required
          type="text"
          :placeholder="$t('msg.search-song-name')"
        />
        <TkButton type="submit" class="">{{ $t('search') }}</TkButton>
      </form>

      <div class="result-list">
        <TkButton
          class=" list-item"
          @click="chooseMusic()"
        >
          <div class="title">{{ $t('edit-current-lyric') }}</div>
        </TkButton>
        <template v-if="resultList.length">
          <TkButton
            v-for="(item, index) in resultList"
            :key="index"
            size="no-style"
            class="list-item"
            @click="chooseMusic(item)"
          >
            <div class="title">{{ item.name }}</div>
            <div class="subtitle">{{ $t('artists') }}: {{ item.artists.map(v => v.name).join(', ') }}</div>
            <div class="subtitle">{{ $t('album') }}: {{ item.album.name }}</div>
          </TkButton>
        </template>
        <TkEmpty v-else/>
      </div>

    </div>

    <div v-show="isDetail" class="search-detail">
      <textarea
        v-model="lyric"
        rows="20"
        :placeholder="$t('msg.type-lyrics-here-lrc')"
      ></textarea>
      <div class="flex justify-between">
        <TkButton class="" @click="isDetail = false">{{ $t('back') }}</TkButton>
        <TkButton class="" @click="saveLyric">{{ $t('save') }}</TkButton>
      </div>
    </div>

  </div>
</template>

<script>
import {
  searchMusic,
  getLyric
} from '@/api/ncm'

export default {
  name: 'LyricSearch',
  components: {},
  props: {
    search: {
      type: String,
      default: ''
    },
    currentLyric: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchText: '',
      resultList: [],
      isLoading: false,
      isDetail: false,
      lyric: '',
    }
  },
  watch: {
    search: {
      handler(val) {
        this.searchText = val
      },
      immediate: true
    }
  },
  methods: {
    async handleSearch() {
      try {
        this.isLoading = true

        const {result} = await searchMusic({
          keywords: this.searchText,
          limit: 20
        })
        // console.log(result)
        this.resultList = result.songs
      } finally {
        this.isLoading = false
      }
    },
    async chooseMusic(item) {
      if (!item) {
        this.lyric = this.currentLyric
        this.isDetail = true
        return
      }
      try {
        this.isLoading = true
        // console.log(item)
        const res = await getLyric({
          id: item.id
        })
        console.log(res)

        const tlyric = res.tlyric.lyric || '' // translated lyric
        const lrc = res.lrc.lyric || ''

        if (tlyric) {
          this.lyric = tlyric + '\n\n\n' + lrc
        } else {
          this.lyric = lrc
        }
      } catch (e) {
        window.$notify.error(e.message)
        console.error(e)

        this.lyric = ''
      } finally {
        this.isLoading = false
        this.isDetail = true
      }
    },
    async saveLyric() {
      this.$emit('saveLyric', this.lyric)
      this.resultList = []
      this.lyric = ''
      this.isDetail = false
    }
  }
}
</script>

<style lang="scss" scoped>
.lyric-search {
  width: 300px;
  min-height: 200px;
  padding: 10px;
  position: relative;

  .search-form {
    input {
      flex: 1;
      margin-right: 5px;
    }
  }

  .result-list {
    margin-top: 10px;
    max-height: 60vh;
    overflow: auto;

    .list-item {
      width: 100%;
      display: block;
      text-align: left;
      font-size: 12px;
      padding: 5px;

      & + .list-item {
        border-top: 1px solid $border-color;
      }

      .title {
        font-weight: bold;
      }

      .subtitle {
        margin-top: 2px;
        font-weight: lighter;
      }
    }
  }

  .search-detail {
    textarea {
      padding: 5px;
      width: 100%;
      box-sizing: border-box;
      background: inherit;
      color: inherit;
    }
  }
}
</style>
