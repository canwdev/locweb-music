<template>
  <TkContextMenu ref="ctxMenu" class="common-menu" :border-margin="borderMargin">
    <ContextMenuList
      :list="mList"
    />
  </TkContextMenu>
</template>

<script>
import ContextMenuList from '@/components/ContextMenuList.vue'

export default {
  name: 'ContextMenuCommon',
  components: {
    ContextMenuList
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    listFn: {
      type: Function,
      default: null
    },
    borderMargin: {
      type: Number,
    }
  },
  data() {
    return {
      mList: [],
      targetData: null,
    }
  },
  methods: {
    open(data) {
      this.targetData = data
      if (this.listFn) {
        this.mList = this.listFn(data)
      } else {
        this.mList = this.list
      }

      this.$refs.ctxMenu.open()
    }
  }
}
</script>

<style lang="scss" scoped>
.common-menu {
  ::v-deep .menu-item {
    &:hover {
      i {
        color: white !important;
      }
    }
  }
}

</style>
