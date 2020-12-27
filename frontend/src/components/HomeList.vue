<template>
  <div class="home-list">
    <Loading :visible="isLoading"/>
    <button
        v-show="showUp"
        class="btn-no-style list-item"
        @click="$emit('goUpDir')"
    >
      <i class="iconfont icon-folder"></i>
      ..
    </button>
    <button
        class="btn-no-style list-item"
        v-for="(item, index) in list"
        :key="index"
        @click="$emit('onItemClick', item)"
    >
      <i class="iconfont" :class="[item.isDirectory ? 'icon-folder' : 'icon-audiotrack']"></i>
      <span class="text-overflow">{{ item.name }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Loading from '@/components/Loading.vue'

export default defineComponent({
  name: 'HomeList',
  components: {
    Loading
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

  .list-item {
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;

    .iconfont {
      margin-right: 5px;
    }

    //& + .list-item {
    //  border-top: $layout-border;
    //}
    &:nth-child(2n) {
      background: rgba(0, 0, 0, 0.1);
    }

    padding: 0 10px;
    height: 40px;
  }
}
</style>
