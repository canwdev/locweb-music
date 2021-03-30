<template>
  <div class="list-menu">
    <button
        v-for="(item, index) in list"
        :key="index"
        class="btn-no-style"
        @click="item.action"
    >{{ item.label }}
    </button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
} from 'vue';

export default defineComponent({
  name: "ListMenu",
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.list-menu {
  width: 200px;

  & > button {
    width: 100%;
    display: block;
    height: 40px;

    & + button {
      border-top: 1px solid $border-color;
    }
  }
}
</style>
