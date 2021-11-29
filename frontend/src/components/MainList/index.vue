<template>
  <div class="main-list">
    <div class="list-action-wrap">
      <div class="list-actions">
        <form action="javascript:">
          <TkInput
            v-model="searchInput"
            class=""
            type="text"
            :placeholder="filterPlaceholder"
          />
          <TkButton
            type="submit"
            size="no-style"
            :title="$t('search')"
            @click="handleSearch"
          ><i class="material-icons">search</i>
          </TkButton>
        </form>

        <slot name="actions"></slot>

        <TkButton
          v-if="!isPlayList"
          size="no-style"
          :title="$t('refresh-list')"
          @click="$emit('refresh')"
        ><i class="material-icons">refresh</i>
        </TkButton>
        <TkButton
          size="no-style"
          :title="$t('locate')"
          @click="locateItem"
        ><i class="material-icons">my_location</i>
        </TkButton>
        <TkButton
          v-if="!isPlayList"
          size="no-style"
          :title="$t('menu')"
          @click="$emit('openMenu')"
        ><i class="material-icons">more_vert</i>
        </TkButton>
      </div>
      <ListItem
        v-if="showUp"
        :item="rootItem"
        @contextmenu.native="$emit('openMenu')"
        @click.native.prevent="$emit('goUpDir')"
      />
    </div>

    <TkLoading absolute :visible="isLoading"/>

    <TkEmpty
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
            @click.native.prevent="$emit('onItemClick', item)"
          />
        </DynamicScrollerItem>

      </template>
    </DynamicScroller>


    <slot></slot>
  </div>
</template>

<script>
import ListItem from './ListItem.vue'
import {MusicItem} from '@/enum'

export default {
  name: 'MainList',
  components: {
    ListItem,
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
      default: 54
    }
  },
  data() {
    return {
      rootItem: new MusicItem({
        isDirectory: true,
        filename: '..'
      }),
      searchInput: '',
      searchText: '',
    }
  },
  computed: {
    filteredList() {
      if (!this.list) {
        return []
      }
      if (!this.searchText) {
        return this.list
      }

      const reg = new RegExp(this.searchText, 'ig')
      return this.list.filter((item) => {
        const title = item.filename || item.title
        return reg.test(title)
      })
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
  methods: {
    handleSearch() {
      this.searchText = this.searchInput
    },
    locateItem() {
      const virtualScroll = this.$refs.mainListEl
      if (!virtualScroll) {
        return
      }

      const el = virtualScroll.$el
      if (el) {
        const index = this.filteredList.findIndex(item => item.id === this.activeId)

        if (index > -1) {
          // this.$toast.info(filteredList.value[index].filename, {
          //   position: 'top',
          // })

          const itemHeight = el.scrollHeight / this.filteredList.length
          el.scrollTop = index * itemHeight
        }
      }
    }
  }
}
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

      &.active {
        color: $primary;
      }

      .material-icons {
        font-size: 18px;
      }
    }
  }

}
</style>
