<template>
  <transition name="fade">
    <div v-show="mVisible" class="modal-dialog-wrap">
      <div class="dialog-shadow" @click="mVisible = false"></div>
      <div class="dialog-main">
        <slot></slot>
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
    }
  },
  setup(props, context) {
    const {visible} = toRefs(props)
    const {mVisible} = useMVisible(visible, context)
    return {
      mVisible
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
    padding: 10px;
    overflow: auto;
    max-width: 95vw;
    max-height: 90vh;
  }
}

</style>
