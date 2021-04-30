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
            placeholder="Search song name"
            v-model="searchText"
        >
        <button type="submit" class="btn-no-style">Search</button>
      </form>

      <div class="result-list">
        <button
            v-for="(item, index) in resultList"
            :key="index"
            class="btn-no-style list-item"
            @click="chooseMusic(item)"
        >
          <div class="title">{{ item.name }}</div>
          <div class="subtitle">Artists: {{ item.artists.map(v => v.name).join(', ') }}</div>
          <div class="subtitle">Album: {{ item.album.name }}</div>
        </button>
      </div>
    </div>

    <div v-show="isDetail" class="search-detail">
      <textarea readonly :value="lyric" rows="20"></textarea>
      <div class="flex justify-between">
        <button class="btn-no-style" @click="isDetail = false">Back</button>
        <button class="btn-no-style" @click="saveLyric">Save</button>
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

export default defineComponent({
  name: "LyricSearch",
  components: {
    Loading,
  },
  props: {
    search: {
      type: String,
      default: ''
    }
  },
  setup(props, context) {
    const {search} = toRefs(props)
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
      try {
        isLoading.value = true
        // console.log(item)
        const res = await getLyric({
          id: item.id
        })
        console.log(res)
        lyric.value = res.lrc.lyric
        isDetail.value = true
      } finally {
        isLoading.value = false
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
    button {
      color: $primary;
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
      width: 100%;
      box-sizing: border-box;
    }
    button {
      color: $primary;
    }
  }
}
</style>
