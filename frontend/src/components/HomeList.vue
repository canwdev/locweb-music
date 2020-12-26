<template>
  <div class="home-list">
    <div
        class="list-item"
        v-for="item in 500"
        :key="item"
    >
      {{ item }}
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'HomeList',
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
    & + .list-item {
      //border-top: $layout-border;
    }
    &:nth-child(2n) {
      background: $blue-3;
      color: white;
    }

    padding: 0 10px;
    font-size: 30px;
    height: 40px;
  }
}
</style>
