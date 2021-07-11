<template>
  <div class="list-menu" :class="themeClass">
    <div
        class="list-item"
        v-for="(item, index) in list"
        :key="index"
    >
      <button
          class="btn-no-style"
          @click="item.action"
          :disabled="item.disabled"
      >{{ item.label }}
      </button>
    </div>

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

  & > .list-item {
    display: block;

    button {
      width: 100%;
      height: 40px;
    }

    & + .list-item {
      border-top: 1px solid $border-color;
    }
  }
}
</style>
