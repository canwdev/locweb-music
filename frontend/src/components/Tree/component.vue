<template>
  <div class="tk-tree">
    <TkTreeItem
      ref="treeFirstItem"
      :item="nodes"
      :selected="selected"
      @onItemClick="$emit('onItemClick', $event)"
      @onItemLazyLoad="$emit('onItemLazyLoad', $event)"
    >
    </TkTreeItem>
  </div>
</template>

<script>
import TkTreeItem from './TreeItem'

export default {
  name: 'TkTree',
  components: {
    TkTreeItem
  },
  props: {
    /**
     * 使用 new TreeNode() 创建节点
     */
    nodes: {
      type: Object,
      default() {
        return {}
      }
    },
    // 当前选中的 id
    selected: {
      type: [Number, String],
      default: null
    }
  },
  mounted() {
    // 自动打开第一个节点
    this.$refs.treeFirstItem.handleClick()
  }
}
</script>
