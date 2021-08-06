<template>
  <div class="download-view">
    <div class="music-download-wrap">
      <div class="wrap-inner-box">
        <div class="main-title">
          Netease Music Down
        </div>
        <form @submit.prevent="handleSearch" class="search-wrap">
          <input v-model="searchText" class="input-styled search-input" type="text" placeholder="歌曲/歌手/专辑/ID/...">
          <button class="search-submit btn-styled" type="submit">Search</button>
        </form>
        <div class="search-result">
          <div v-if="resultList.length" class="result-list">
            <button
                v-for="(item, index) in resultList"
                :key="index"
                class="btn-no-style list-item"
            >
              <div class="title">{{ item.name }}</div>
              <div class="subtitle">{{ $t('artists') }}: {{ item.artists.map(v => v.name).join(', ') }}</div>
              <div class="subtitle">{{ $t('album') }}: {{ item.album.name }}</div>
            </button>
          </div>

          <NoData v-else/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount, ref
} from 'vue';
import NoData from "../NoData.vue";
import {searchMusic} from "@/api/ncm";

export default defineComponent({
  name: "DownloadView",
  components: {
    NoData,
  },
  setup() {
    const searchText = ref('')
    const resultList = ref([])
    const isLoading = ref(false)

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

    return {
      searchText,
      resultList,
      isLoading,
      handleSearch
    }
  }
})
</script>

<style lang="scss" scoped>
@media screen and (min-width: 425px) {
  .music-download-wrap {
    width: 425px;
    position: relative;
    margin: 10px auto;
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
    background: #7ed593;
  }

}

.download-view {
  height: 100%;
  overflow: auto;

  .main-title {
    background: linear-gradient(
            180deg, #80D694 0, #48BD7B);
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
}
</style>
