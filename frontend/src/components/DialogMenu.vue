<template>
  <TkModalDialog
    v-model="mVisible"
  >
    <ListMenu
      :list="list"
      @click="autoClose && (mVisible = false)"
    />
  </TkModalDialog>
</template>

<script >
import visibleMixin from '@/mixins/visible'
import ListMenu from '@/components/ListMenu.vue'

export default {
  name: 'DialogMenu',
  mixins: [visibleMixin],
  components: {
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
  }
}
</script>

<style scoped>

</style>
