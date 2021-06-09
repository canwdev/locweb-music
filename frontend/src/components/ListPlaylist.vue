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
        {{ item.data.title }}
      </template>
      <template v-slot:append="{item}">
        <div @click.stop>
          {{ item.id }}
          <button class="btn-styled" @click="logNode(item)">{{ item.data.id }}</button>
          <button class="btn-styled" @click="handleAdd(item)">add</button>
          <button v-if="item.parent" class="btn-styled" @click="handleDel(item)">del</button>
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
        const {list} = await getPlaylist({
          pid: node.data.id
        })
        done(list.map(i => {
          return new TreeNode({
            isLazy: true,
            data: i
          })
        }))
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
      const flag = confirm(`WARNING!! Delete 《${item.data.id}》?\nThis operation cannot be undone.`)
      if (!flag) {
        return
      }
      if (item.parent) {
        const res = item.parent.removeChild(item);
        console.log(res)
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
