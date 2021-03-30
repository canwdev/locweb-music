<template>
  <div class="main-list">
    <div class="list-action-wrap">
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
      <ListItem
          :item="rootItem"
          v-if="showUp"
          @click.prevent="$emit('goUpDir')"
      />
    </div>

    <Loading :visible="isLoading"/>

    <NoData
        v-if="!isLoading && filteredList.length === 0"
    />

    <DynamicScroller
        ref="mainListEl"
        class="virtual-scroller"
        :items="filteredList"
        :min-item-size="minItemSize"
    >
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
              :is-show-action="!isPlayList"
              @onAction="i => $emit('onItemAction', i)"
              @click.prevent="$emit('onItemClick', item)"
          />
        </DynamicScrollerItem>

      </template>
    </DynamicScroller>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, toRefs} from 'vue';
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
    },
    minItemSize: {
      type: Number,
      default: 40
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
      // @ts-ignore: TS2339
      // console.log('wrapEl', virtualScroll.$el)

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
          // @ts-ignore
          window.$notify.info(filteredList.value[index].filename, {
            position: 'top',
          })

          const itemHeight = el.scrollHeight / filteredList.value.length
          el.scrollTop = index * itemHeight
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

    //::v-deep .vue-recycle-scroller__item-view {
    //  & + .vue-recycle-scroller__item-view {
    //    border-top: $layout-border;
    //  }
    //}
  }

  .list-action-wrap {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, .9);

    .list-item-wrap {
      border-bottom: 1px solid $border-color;
    }
  }

  .list-actions {
    padding: 4px 10px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 1;
    height: 30px;
    border-bottom: 1px solid $border-color;

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
