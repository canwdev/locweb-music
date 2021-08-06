<template>
  <div class="lyric-search">
    <Loading
        absolute
        :visible="isLoading"
    />
    <div v-show="!isDetail" class="search-index">
      <form @submit.prevent="handleSearch" class="flex items-center search-form">
        <input
            class="input-styled"
            required
            type="text"
            :placeholder="$t('msg.search-song-name')"
            v-model="searchText"
        >
        <button type="submit" class="btn-styled">{{ $t('search') }}</button>
      </form>

      <div class="result-list">
        <button
            class="btn-styled list-item"
            @click="chooseMusic()"
        >
          <div class="title">{{ $t('edit-current-lyric') }}</div>
        </button>
        <template v-if="resultList.length">
          <button
              v-for="(item, index) in resultList"
              :key="index"
              class="btn-no-style list-item"
              @click="chooseMusic(item)"
          >
            <div class="title">{{ item.name }}</div>
            <div class="subtitle">{{ $t('artists') }}: {{ item.artists.map(v => v.name).join(', ') }}</div>
            <div class="subtitle">{{ $t('album') }}: {{ item.album.name }}</div>
          </button>
        </template>
        <NoData v-else/>
      </div>

    </div>

    <div v-show="isDetail" class="search-detail">
      <textarea
          v-model="lyric"
          rows="20"
          :placeholder="$t('msg.type-lyrics-here-lrc')"
      ></textarea>
      <div class="flex justify-between">
        <button class="btn-styled" @click="isDetail = false">{{ $t('back') }}</button>
        <button class="btn-styled" @click="saveLyric">{{ $t('save') }}</button>
      </div>
    </div>

  </div>
</template>

<script>
import {defineComponent, ref, toRefs, watch} from 'vue'
import {
  searchMusic,
  getLyric
} from '@/api/ncm'
import Loading from '@/components/Loading.vue'
import NoData from "./NoData.vue";

export default defineComponent({
  name: "LyricSearch",
  components: {
    Loading,
    NoData
  },
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
  setup(props, context) {
    const {search, currentLyric} = toRefs(props)
    const searchText = ref('')
    const resultList = ref([])
    const isLoading = ref(false)
    const isDetail = ref(false)
    const lyric = ref('')

    watch(search, (val) => {
      searchText.value = val
    }, {
      immediate: true
    })

    const handleSearch = async () => {
      try {
        isLoading.value = true

        const {result} = await searchMusic({
          keywords: searchText.value,
          limit: 20
        })
        // console.log(result)
        resultList.value = result.songs
      } finally {
        isLoading.value = false
      }
    }

    const chooseMusic = async (item) => {
      if (!item) {
        lyric.value = currentLyric.value
        isDetail.value = true
        return
      }
      try {
        isLoading.value = true
        // console.log(item)
        const res = await getLyric({
          id: item.id
        })
        console.log(res)

        const tlyric = res.tlyric.lyric || '' // translated lyric
        const lrc = res.lrc.lyric || ''

        if (tlyric) {
          lyric.value = tlyric + '\n\n\n' + lrc
        } else {
          lyric.value = lrc
        }
      } catch (e) {
        window.$notify.error(e.message)
        console.error(e)

        lyric.value = ''
      } finally {
        isLoading.value = false
        isDetail.value = true
      }
    }

    const saveLyric = async () => {
      context.emit('saveLyric', lyric.value)
      resultList.value = []
      lyric.value = ''
      isDetail.value = false
    }

    return {
      isLoading,
      searchText,
      handleSearch,
      resultList,
      chooseMusic,
      isDetail,
      lyric,
      saveLyric
    }
  }
})
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
