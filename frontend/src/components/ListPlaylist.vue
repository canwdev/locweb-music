<template>
  <div class="list-playlist">
    <TkTree
        :nodes="treeData"
        :selected-id="selected && selected.id"
        @onItemClick="handleClick"
        @onItemLazyLoad="handleLazyLoad"
    >
      <template v-slot:icon>
        <span class="material-icons">folder</span>
      </template>
      <template v-slot:append="{item}">
        <div @click.stop>
          {{item.id}}
          <button class="btn-styled" @click="handleAdd(item)">add</button>
          <button class="btn-styled" @click="handleDel(item)">del</button>
        </div>
      </template>
    </TkTree>

  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import TreeNode from '@/components/Tree/tree-node.js'
import {
  getPlaylist,
  addPlaylist
} from "@/api/playlist";

export default defineComponent({
  name: 'ListPlaylist',
  setup() {
    const root = new TreeNode({
      title: 'Playlist',
      isLazy: true,
      id: -1,
    })
    const treeData = ref(root)
    const selected = ref<TreeNode|null>(root)
    const isLoading = ref<boolean>(false)
    // const breadcrumbList = ref<Array<string>>([])

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
      id = id !== undefined ? id : selected.value.id
      const rootNode = treeData.value
      if (id === rootNode.id) {
        return []
      }
      return getPathByKey(id, 'id', rootNode.children)
    }

    const handleClick = (node) => {
      selected.value = node
      // console.log('handleClick', node)
      // const list = getNodePathById(node.id)
      // breadcrumbList.value = [treeData.value, ...list].map(item => item.name)
    }

    const handleLazyLoad = async ({node, key, done, fail}) => {

      const {list} = await getPlaylist({
        pid: node.id
      })
      console.log('handleLazyLoad', node, key)
      console.log('list',list)

      done(list.map(i => {
        return new TreeNode({
          ...i,
          isLazy: true,
          id: i.id
        })
      }))
    }

    const handleAdd = async (item) => {
      try {
        const pid = item.id
        const title = prompt(`Add Playlist under ${pid}`, 'Playlist' + Date.now())
        if (!title) {
          return
        }
        isLoading.value = true
        const res = await addPlaylist({
          pid,
          title
        })
        item.isLazy = true
        console.log('ok', res)
        item.toggleOpen()
      } catch (e) {
        console.error(e)
      } finally {
        isLoading.value = false
      }
    }

    const handleDel = async (item) => {
      const flag = confirm(`WARNING!! Delete 《${item.title}》?\nThis operation cannot be undone.`)
      if (!flag) {
        return
      }
    }

      return {
      selected,
      treeData,
      handleClick,
      handleLazyLoad,
      handleAdd,
      handleDel,
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
