<template>
  <transition name="fade">
    <div v-show="mVisible" class="modal-dialog-wrap">
      <div class="dialog-shadow" @click="mVisible = false"></div>
      <div class="dialog-main" :class="{dark, 'no-radius': noRadius}">
        <button v-if="isShowClose" class="btn-no-style btn-close" @click="mVisible = false">
          <i class="material-icons">clear</i>
        </button>
        <div class="dialog-inner" :class="{'limited-size': !unlimitedSize}">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {defineComponent, toRefs} from 'vue';
import useMVisible from "@/composables/useMVisible"

export default defineComponent({
  name: "ModalDialog",
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    isShowClose: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    },
    unlimitedSize: {
      type: Boolean,
      default: false
    },
    noRadius: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const {visible} = toRefs(props)
    return {
      ...useMVisible(visible, context)
    }
  }
})
</script>

<style lang="scss" scoped>
.modal-dialog-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;

  .dialog-shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
  }
  .dialog-main {
    border-radius: $generic-border-radius;
    position: relative;
    background: white;
    color: black;
    box-shadow: 0 5px 10px rgba(0, 0, 0, .5);

    &.no-radius {
      border-radius: 0;
    }

    &.dark {
      background: rgba(0,0,0,0.8);
      color: white;
      box-shadow: 0 0 8px 2px $primary;

      &>.btn-close {
        background: $primary;
        color: white;
      }
    }

    .btn-close {
      position: absolute;
      top: -14px;
      right: -14px;
      z-index: 2;
      background: white;
      color: $primary;
      width: 28px;
      height: 28px;
      border-radius: $generic-border-radius;
      border: 2px solid;
      box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
      @media screen and (max-width: $mobile_min_width) {
        top: 5px;
        right: 5px;
      }
    }

    .dialog-inner {
      width: 100%;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;

      &.limited-size {
        max-width: 95vw;
        max-height: 92vh;
      }
    }
  }
}

</style>
