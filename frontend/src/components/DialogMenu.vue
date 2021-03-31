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
import {defineComponent, toRefs} from 'vue';
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
    // @ts-ignore
    const {visible} = toRefs(props)
    const {mVisible} = useMVisible(visible, context)
    return {
      mVisible
    }
  }
})
</script>

<style scoped>

</style>
