<template>
  <div class="tk-tree">
    <TkTreeItem
      ref="treeFirstItem"
      :item="nodes"
      :selected-id="selectedId"
      @onItemClick="$emit('onItemClick', $event)"
      @onItemDbClick="$emit('onItemDbClick', $event)"
      @onItemLazyLoad="$emit('onItemLazyLoad', $event)"
    >
      <template v-slot:icon="{data}">
        <slot name="icon" :data="data"></slot>
      </template>
      <template v-slot:title="{item}">
        <slot name="title" :item="item"></slot>
      </template>
      <template v-slot:append="{item}">
        <slot name="append" :item="item"></slot>
      </template>
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
    selectedId: {
      type: [Number, String],
      default: null
    }
  },
  mounted() {
    // 自动打开第一个节点
    this.$refs.treeFirstItem.handleClick()
  },
  // methods() {
  //
  // }
}
</script>

<style lang="scss" scoped>
.tk-tree {
  width: 100%;
}
</style>
