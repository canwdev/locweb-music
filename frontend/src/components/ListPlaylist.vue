<template>
  <div class="list-playlist">
    <TkTree
        :nodes="treeData"
        :selected="selected"
        @onItemClick="handleClick"
        @onItemLazyLoad="handleLazyLoad"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import TreeNode from '@/components/Tree/tree-node.js'

export default defineComponent({
  name: 'ListPlaylist',
  setup() {
    const treeData = ref(new TreeNode({
      name: 'My Tree',
      children: [
        {
          name: 'hello'
        },
        {
          name: 'wat'
        },
        {
          name: 'New Lazy Folder New Lazy Folder New Lazy Folder',
          lazy: true
        },
        {
          name: 'child folder',
          children: [
            {
              name: 'child folder',
              children: [{name: 'hello'}, {name: 'wat'}].map(i => new TreeNode(i))
            },
            {
              name: 'child folder',
              children: [{name: 'hello'}, {name: 'wat'}].map(i => new TreeNode(i))
            },
            {name: 'hello'},
            {name: 'wat'}
          ].map(i => new TreeNode(i))
        }
      ].map(i => new TreeNode(i))
    }))
    const selected = ref(null)
    const breadcrumbList = ref<Array<string>>([])

    let nodePathArray: TreeNode[] = []

    const getNodePath = (node: TreeNode, key, value) => {
      nodePathArray.push(node)

      // 找到符合条件的节点，通过throw终止掉递归
      if (node[key] === value) {
        // 也可以直接使用return;结束循环
        throw new Error('over!')
      }
      if (node.children && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          getNodePath(node.children[i], key, value)
        }
        // 当前节点的子节点遍历完依旧没找到，则删除路径中的该节点
        nodePathArray.pop()
      } else {
        // 找到叶子节点时，删除路径当中的该叶子节点
        nodePathArray.pop()
      }
    }

    // 获取指定节点的路径数组
    const getPathByKey = (value, key, arr) => {
      // 用于存储节点唯一标识值路径数组
      nodePathArray = []
      try {
        for (let i = 0; i < arr.length; i++) {
          getNodePath(arr[i], key, value)
        }
      } catch (e) {
        return nodePathArray
      }
    }

    const getNodePathById = (id) => {
      id = id !== undefined ? id : selected.value
      const rootNode = treeData.value
      if (id === rootNode.id) {
        return []
      }
      return getPathByKey(id, 'id', rootNode.children)
    }

    const handleClick = (node) => {
      selected.value = node.id
      console.log('handleClick', node)
      // const list = getNodePathById(node.id)
      // breadcrumbList.value = [treeData.value, ...list].map(item => item.name)
    }

    return {
      selected,
      treeData,
      handleClick,
      handleLazyLoad({node, key, done, fail}) {
        console.log('handleLazyLoad', node, key)
        setTimeout(() => {
          // fail()
          done([
            {name: 'hello'},
            {
              name: 'New Lazy Folder New Lazy Folder New Lazy Folder',
              lazy: true
            },
            {name: 'wat'},
            {
              name: 'Empty Folder',
              children: []
            },
            {
              name: 'Lazy',
              lazy: true
            }
          ].map(i => new TreeNode(i)))
        }, 500)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.list-playlist {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
