<template>
  <div class="main-list">
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

    <NoData
        v-if="!isLoading && filteredList.length === 0"
        text="List is empty"/>

    <DynamicScroller
        ref="mainListEl"
        class="virtual-scroller"
        :items="filteredList"
        :min-item-size="40"
    >
      <template #before>
        <ListItem
            :item="rootItem"
            v-if="showUp"
            @click.prevent="$emit('goUpDir')"
        />
      </template>
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
        >
          <ListItem
              :item="item"
              :active="activeId === item.id"
              :is-big-item="isPlayList"
              :is-paused="isPaused"
              @click.prevent="$emit('onItemClick', item)"
          />
        </DynamicScrollerItem>

      </template>
    </DynamicScroller>
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
    NoData,
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
    const {list, activeId, isPlayList} = toRefs(props)
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
      const virtualScroll = mainListEl.value
      if (!virtualScroll) {
        return;
      }
      console.log('wrapEl', virtualScroll)

      // @ts-ignore: TS2339
      const el = virtualScroll.$el
      if (el) {
        // @ts-ignore: TS2339
        // const item = virtualScroll.querySelector(`a[data-index="${activeId.value}"]`)
        // if (!item) {
        //   return
        // }

        const index = filteredList.value.findIndex(item => item.id === activeId.value)

        if (index > -1) {
          el.scrollTop = index * (isPlayList.value ? 55 : 40)
        }

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
  overflow: hidden;
  top: 45px;
  left: 0;
  width: 100%;
  bottom: 75px;
  //padding: 45px 0 80px;
  //box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .virtual-scroller {
    overflow: auto;
    flex: 1;
    scroll-behavior: smooth;

    ::v-deep .vue-recycle-scroller__item-view {
      &:nth-child(even) {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }


  .list-actions {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, .9);
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
