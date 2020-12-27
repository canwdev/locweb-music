<template>
  <div class="home-list">
    <button
        class="btn-no-style list-item"
        v-for="(item, index) in list"
        :key="index"
        @click="$emit('onItemClick', item)"
    >
      <span class="text-overflow">{{ item }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'HomeList',
  props: {
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

  .list-item {
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;

    //& + .list-item {
    //  border-top: $layout-border;
    //}
    &:nth-child(2n) {
      background: rgba(0,0,0,0.1);
    }

    padding: 0 10px;
    height: 40px;
  }
}
</style>
