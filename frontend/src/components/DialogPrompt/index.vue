<template>
  <ModalDialog v-model:visible="mVisible">
    <div class="dialog-confirm-wrap">
      <div class="dialog-content-row">
        <slot>{{ content }}</slot>
      </div>
      <div class="dialog-action-row">
        <button v-if="showCancel" class="btn-styled" @click="handleCancel">Cancel</button>
        <button class="btn-styled" @click="handleNo">No</button>
        <button class="btn-styled" @click="handleYes">Yes</button>
      </div>
    </div>

  </ModalDialog>
</template>

<script lang="ts">
import ModalDialog from "../ModalDialog.vue"
import {computed, defineComponent, ref} from "vue"
export default defineComponent({
  name: "DialogConfirm",
  components: {
    ModalDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    content: {
      type: [String, Number],
      default: 'Confirm?'
    },
    showCancel: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const isShow = ref(false)
    const mVisible = computed({
      get() {
        return props.visible || isShow.value
      },
      set(val: boolean) {
        isShow.value = val
        context.emit('update:visible', val)
      }
    })

    const close = () => {
      mVisible.value = false
    }

    const handleCancel = () => {
      context.emit('onMid')
      close()
    }
    const handleNo = () => {
      context.emit('onNo')
      close()
    }
    const handleYes = () => {
      context.emit('onYes')
      close()
    }

    return {
      isShow,
      mVisible,
      handleNo,
      handleYes,
      handleCancel
    }
  }
})
</script>

<style lang="scss" scoped>
.dialog-confirm-wrap {
  min-width: 200px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .dialog-content-row {
    flex: 1;
    min-height: 30px;
    margin-bottom: 5px;
    user-select: text;
  }
  .dialog-action-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    button {
      margin-left: 5px;
    }
  }
}
</style>
