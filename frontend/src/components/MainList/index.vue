<template>
  <div class="main-list" ref="mainListEl">
    <div class="list-actions">
      <form action="javascript:">
        <input
            class="input-styled"
            v-model="searchInput"
            type="text" placeholder="Filter Text"
        >
        <button
            type="submit"
            class="btn-no-style"
            @click="handleSearch"
            title="Search"
        ><i class="material-icons">search</i>
        </button>
      </form>
      <button
          v-if="!isPlayList"
          class="btn-no-style"
          @click="$emit('refresh')"
          title="Refresh List"
      ><i class="material-icons">refresh</i>
      </button>
      <button
          class="btn-no-style"
          @click="locateItem"
          title="Locate"
      ><i class="material-icons">my_location</i>
      </button>
    </div>

    <Loading :visible="isLoading"/>

    <ListItem
        :item="rootItem"
        v-show="showUp"
        @click="$emit('goUpDir')"
    />

    <NoData
        v-if="!isLoading && filteredList.length === 0"
        text="List is empty"/>

    <ListItem
        v-for="(item) in filteredList"
        :key="item.id"
        :item="item"
        :data-index="item.id"
        :active="activeId === item.id"
        :is-big-item="isPlayList"
        :is-paused="isPaused"
        @click="$emit('onItemClick', item)"
    />


  </div>
</template>

<script lang="ts">
import {defineComponent, ref, toRefs, computed} from 'vue';
import Loading from '@/components/Loading.vue'
import ListItem from './ListItem.vue'
import NoData from '@/components/NoData.vue'
import {MusicItem} from "@/enum";

export default defineComponent({
  name: 'MainList',
  components: {
    Loading,
    ListItem,
    NoData
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    showUp: {
      type: Boolean,
      default: false
    },
    isPlayList: {
      type: Boolean,
      default: false
    },
    isPaused: {
      type: Boolean,
      default: false
    },
    activeId: {
      type: Number,
      default: null
    },
    list: {
      type: Array
    }
  },
  setup(props) {
    const {list, activeId} = toRefs(props)
    const searchInput = ref('')
    const searchText = ref('')

    const mainListEl = ref(null)

    const filteredList = computed(() => {
      if (!list || !list.value) {
        return []
      }
      if (!searchText.value) {
        return list.value
      }

      const reg = new RegExp(searchText.value, 'ig')
      return list.value.filter((item) => {
        // @ts-ignore: TS2571
        const title = item.filename || item.title
        return reg.test(title)
      })
    })
    const handleSearch = () => {
      searchText.value = searchInput.value
    }

    const locateItem = () => {
      const wrapEl = mainListEl.value
      if (wrapEl) {
        // @ts-ignore: TS2339
        const item = wrapEl.querySelector(`a[data-index="${activeId.value}"]`)
        if (!item) {
          return
        }
        // item.scrollIntoView({
        //   behavior: 'smooth'
        // })
        // @ts-ignore: TS2339
        wrapEl.scrollTop = item.offsetTop - 39
      }
    }

    return {
      rootItem: new MusicItem({
        isDirectory: true,
        filename: '..'
      }),
      searchInput,
      handleSearch,
      filteredList,
      mainListEl,
      locateItem
    }
  }
})
</script>

<style lang="scss" scoped>
.main-list {
  position: absolute;
  overflow: auto;
  top: 45px;
  left: 0;
  width: 100%;
  bottom: 80px;
  //padding: 45px 0 80px;
  //box-sizing: border-box;
  scroll-behavior: smooth;

  .list-actions {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255,255,255,.9);
    border-bottom: 1px solid $border-color;
    padding: 4px 10px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 1;
    height: 30px;

    form {
      height: 100%;
      flex: 1;
      display: flex;
      align-items: center;

      input {
        height: 28px;
        flex: 1;
        margin-right: 5px;
      }
    }

    button {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      .material-icons {
        font-size: 18px;
      }
    }
  }

  .loading-shade {
    position: fixed;
    top: 45px;
    left: 0;
    width: 100%;
    bottom: 55px;
  }

}
</style>
