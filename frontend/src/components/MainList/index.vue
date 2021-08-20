<template>
  <div class="main-list">
    <div class="list-action-wrap">
      <div class="list-actions">
        <form action="javascript:">
          <input
              class="input-styled"
              v-model="searchInput"
              type="text"
              :placeholder="filterPlaceholder"
          >
          <button
              type="submit"
              class="btn-no-style"
              @click="handleSearch"
              :title="$t('search')"
          ><i class="material-icons">search</i>
          </button>
        </form>
        <button
            v-if="!isPlayList"
            class="btn-no-style"
            @click="$emit('refresh')"
            :title="$t('refresh-list')"
        ><i class="material-icons">refresh</i>
        </button>
        <button
            class="btn-no-style"
            @click="locateItem"
            :title="$t('locate')"
        ><i class="material-icons">my_location</i>
        </button>
        <button
            v-if="!isPlayList"
            class="btn-no-style"
            @click="$emit('openMenu')"
            :title="$t('menu')"
        ><i class="material-icons">more_vert</i>
        </button>
      </div>
      <ListItem
          :item="rootItem"
          v-if="showUp"
          @click.prevent="$emit('goUpDir')"
      />
    </div>

    <Loading absolute :visible="isLoading"/>

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
              :is-show-action="true"
              @onAction="i => $emit('onItemAction', i)"
              @click.prevent="$emit('onItemClick', item)"
          />
        </DynamicScrollerItem>

      </template>
    </DynamicScroller>

    <slot></slot>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, toRefs, watch} from 'vue';
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
    filterPlaceholder: {
      type: String,
      default: 'Filter Text'
    },
    list: {
      type: Array
    },
    minItemSize: {
      type: Number,
      default: 40
    }
  },
  watch: {
    list() {
      this.searchText = this.searchInput = ''
    },
    searchInput(val) {
      if (!val) {
        this.searchText = ''
      }
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


      const el = virtualScroll.$el
      if (el) {

        const index = filteredList.value.findIndex(item => item.id === activeId.value)

        if (index > -1) {

          // window.$notify.info(filteredList.value[index].filename, {
          //   position: 'top',
          // })

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
      locateItem,
      searchText
    }
  }
})
</script>

<style lang="scss" scoped>
.main-list {
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .virtual-scroller {
    overflow: auto;
    flex: 1;
    //scroll-behavior: smooth;

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

    .list-item-wrap {
      border-bottom: 1px solid $border-color;
    }
  }

  .list-actions {
    padding: 2px 10px;
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

}
</style>
