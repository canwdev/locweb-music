<template>
  <div class="home-list">
    <Loading :visible="isLoading"/>

    <ListItem
        :item="{
          isDirectory: true,
          name: '..'
        }"
        v-show="showUp"
        @click="$emit('goUpDir')"
    />

    <ListItem
        v-for="(item, index) in list"
        :key="index"
        :item="item"
        @click="$emit('onItemClick', item)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Loading from '@/components/Loading.vue'
import ListItem from './ListItem.vue'

export default defineComponent({
  name: 'HomeList',
  components: {
    Loading,
    ListItem
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
