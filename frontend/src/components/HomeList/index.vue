<template>
  <div class="home-list">
    <Loading :visible="isLoading"/>

    <ListItem
        :item="rootItem"
        v-show="showUp"
        @click="$emit('goUpDir')"
    />

    <NoData
        v-if="!isLoading && list.length === 0"
        text="List is empty"/>

    <ListItem
        v-for="(item, index) in list"
        :key="index"
        :item="item"
        :active="activeIndex === index"
        :is-big-item="isBigItem"
        :is-paused="isPaused"
        @click="$emit('onItemClick', item)"
    />


  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Loading from '@/components/Loading.vue'
import ListItem from './ListItem.vue'
import NoData from '@/components/NoData.vue'
import {MusicItem} from "@/enum";

export default defineComponent({
  name: 'HomeList',
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
    isBigItem: {
      type: Boolean,
      default: false
    },
    isPaused: {
      type: Boolean,
      default: false
    },
    activeIndex: {
      type: Number,
      default: null
    },
    list: {
      type: Array
    }
  },
  setup() {
    return {
      rootItem: new MusicItem({
        isDirectory: true,
        filename: '..'
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.home-list {
  position: absolute;
  overflow: auto;
  top: 45px;
  left: 0;
  width: 100%;
  bottom: 80px;
  //padding: 45px 0 80px;
  //box-sizing: border-box;
  //scroll-behavior: smooth;

  .loading-shade {
    position: fixed;
    top: 45px;
    left: 0;
    width: 100%;
    bottom: 55px;
  }

}
</style>
