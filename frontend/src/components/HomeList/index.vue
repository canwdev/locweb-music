<template>
  <div class="home-list">
    <Loading :visible="isLoading"/>

    <ListItem
        :item="{
          isDirectory: true,
          filename: '..'
        }"
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
        @click="$emit('onItemClick', item)"
    />


  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Loading from '@/components/Loading.vue'
import ListItem from './ListItem.vue'
import NoData from '@/components/NoData.vue'

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
    activeIndex: {
      type: Number,
      default: null
    },
    list: {
      type: Array
    }
  }
})
</script>

<style lang="scss" scoped>
.home-list {
  height: 100%;
  overflow: auto;
  padding: 45px 0 55px;
  box-sizing: border-box;
  position: relative;

  .loading-shade {
    position: fixed;
    top: 45px;
    left: 0;
    width: 100%;
    bottom: 55px;
  }

}
</style>
