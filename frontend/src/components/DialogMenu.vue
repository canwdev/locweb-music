<template>
  <ModalDialog
      v-model:visible="mVisible"
  >
    <ListMenu
        :list="list"
        @click="autoClose && (mVisible = false)"
    />
  </ModalDialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import useMVisible from "@/composables/useMVisible"
import ModalDialog from '@/components/ModalDialog.vue'
import ListMenu from '@/components/ListMenu.vue'

export default defineComponent({
  name: "DialogMenu",
  components: {
    ModalDialog,
    ListMenu
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    autoClose: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup(props, context) {

    return {
      ...useMVisible(props.visible, context)
    }
  }
})
</script>

<style scoped>

</style>
