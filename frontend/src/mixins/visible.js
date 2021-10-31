export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    mVisible: {
      get() {
        return this.visible
      },
      set(nv) {
        this.$emit('update:visible', nv)
      }
    }
  }
}
