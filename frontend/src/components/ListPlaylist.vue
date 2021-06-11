<template>
  <div class="list-playlist">
    <TkTree
        :nodes="treeData"
        :selected-id="selected && selected.id"
        @onItemClick="handleNodeClick"
        @onItemLazyLoad="handleLazyLoad"
    >
      <template v-slot:icon="{data}">
        <span v-if="data.isFolder" class="material-icons">folder</span>
        <span v-else class="material-icons">audiotrack</span>
      </template>
      <template v-slot:title="{item}">
        {{ item.data.title }} | {{ item.id }} |
        <button class="btn-no-style" @click="logNode(item)">{{ item.data.id }}</button>
      </template>
      <template v-slot:append="{item}">
        <button class="btn-no-style" @click="handleAdd(item)" title="Add"><i class="material-icons">add</i></button>
        <button v-if="item.parent" class="btn-no-style" @click="handleDel(item)" title="Delete"><i
            class="material-icons">delete</i></button>
      </template>
    </TkTree>

  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import TreeNode from '@/components/Tree/tree-node.js'
import {
  getPlaylist,
  addPlaylist,
  deletePlaylist
} from "@/api/playlist";

export default defineComponent({
  name: 'ListPlaylist',
  setup() {
    const root = new TreeNode({
      isLazy: true,
      data: {
        id: -1,
        title: 'Playlist',
      }
    })
    const treeData = ref(root)
    const selected = ref<TreeNode | null>(root)
    const isLoading = ref<boolean>(false)

    const handleNodeClick = (node) => {
      selected.value = node
    }

    const handleLazyLoad = async ({node, done, fail}) => {
      try {
        const {list, musics} = await getPlaylist({
          pid: node.data.id,
          showMusic: true
        })
        const resList = [
          ...list.map(i => new TreeNode({
            isLazy: true,
            data: i
          })),
          ...musics.map(i => new TreeNode({
            data: i
          }))
        ]
        done(resList)
      } catch (e) {
        fail(e)
      }
    }

    const handleAdd = async (node) => {
      try {
        const pid = node.data.id
        const title = prompt(`Add Playlist under ${pid}`, 'Playlist' + Date.now())
        if (!title) {
          return
        }
        isLoading.value = true
        const res = await addPlaylist({
          pid,
          title
        })
        // console.log('ok', res)
        node.prependChild(new TreeNode({
          isLazy: true,
          data: res,
          parent: node
        }))
        // node.isLazy = true
        // node.$click()
      } catch (e) {
        console.error(e)
      } finally {
        isLoading.value = false
      }
    }

    const handleDel = async (item) => {
      if (!item.parent) {
        return
      }
      const flag = confirm(`WARNING!! Delete 《${item.data.title}》 and its sub?\nThis operation cannot be undone.`)
      if (!flag) {
        return
      }
      isLoading.value = true
      try {
        const count = await deletePlaylist({
          id: item.data.id
        })
        item.parent.removeChild(item)
        window.$notify.success(`Playlist deleted (${count})`)
      } catch (e) {
        console.error(e)
      } finally {
        isLoading.value = false
      }
    }

    return {
      selected,
      treeData,
      handleNodeClick,
      handleLazyLoad,
      handleAdd,
      handleDel,
      logNode(n) {
        console.log(n)
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
