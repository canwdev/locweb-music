<template>
  <transition name="fade">
    <div v-show="visible" class="loading-shade flex items-center justify-center">
      <div class="loading" :class="[isDarkTheme ? 'bg-dark' : 'bg-glass-white']">
        <i class="material-icons">hourglass_empty</i>
        <span v-if="text" class="text">{{ text }}</span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import store from "@/store";

export default defineComponent({
  name: "Loading",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    absolute: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: "Loading"
    }
  },
  setup() {
    return {
      isDarkTheme: computed(() => store.getters.isDarkTheme),
    }
  }
})
</script>

<style lang="scss" scoped>
.loading-shade {
  background: rgba(0, 0, 0, 0.2);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;

  &.absolute {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 0;
    z-index: 10;
  }

  .loading {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    border-radius: 10px;
    flex-direction: column;

    &.bg-dark {
      box-shadow: 0 0 8px 2px $primary;
    }

    .material-icons {
      font-size: 32px;
      animation: rotating180 1.5s infinite linear;
    }

    .text {
      padding-top: 5px;
      font-size: 14px;
    }
  }
}


</style>
