<template>
  <div class="list-menu" :class="themeClass">
    <button
        v-for="(item, index) in list"
        :key="index"
        class="btn-no-style"
        @click="item.action"
        :disabled="item.disabled"
    >{{ item.label }}
    </button>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
} from 'vue';
import store from "@/store";

export default defineComponent({
  name: "ListMenu",
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup() {
    return {
      themeClass: computed(() => store.getters.themeClass)
    }
  }
})
</script>

<style lang="scss" scoped>
.list-menu {
  width: 200px;

  &.bg-light {
    border-radius: $generic-border-radius;
  }

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
