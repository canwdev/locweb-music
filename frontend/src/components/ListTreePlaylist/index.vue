<template>
  <div class="list-playlist">
    <TkTree
        :nodes="treeData"
        :selected-id="selected && selected.id"
        @onItemClick="handleNodeClick"
        @onItemDbClick="playItem"
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
        <button v-if="!item.isMusic" class="btn-no-style" @click="handleAdd(item)" :title="$t('add')"><i class="material-icons">add</i></button>
        <button v-else class="btn-no-style" @click="playItem(item)" :title="$t('play')"><i class="material-icons">play_arrow</i></button>
        <button v-if="item.parent" class="btn-no-style" @click="handleDel(item)" :title="$t('delete')"><i
            class="material-icons">delete</i></button>
        <button v-if="!item.isMusic" class="btn-no-style" @click="item.$doLazyLoad()" :title="$t('refresh')"><i class="material-icons">refresh</i></button>
        <button class="btn-no-style" @click="logNode(item)" :title="`id: ${item.id}\ndata-id: ${item.data.id}\n`"><i class="material-icons">bug_report</i></button>
      </template>
    </TkTree>

  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {useI18n} from "vue-i18n";
import TreeNode from '@/components/Tree/tree-node.js'
import {
  getPlaylist,
  addPlaylist,
  deletePlaylist,
  removePlaylistMusic
} from "@/api/playlist";
import store from "@/store";
import bus, {ACTION_PLAY_START} from "@/utils/bus";
import {MusicItem} from "@/enum";

export default defineComponent({
  name: 'ListPlaylist',
  setup() {
    const {t} = useI18n()
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
            isMusic: true,
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
      let confirmMsg = `WARNING!! Delete Playlist《${item.data.title}》 and its sub?`
      if (item.isMusic) {
        confirmMsg = `WARNING!! Remove《${item.data.title}》?`
      }
      const flag = confirm(confirmMsg)
      if (!flag) {
        return
      }
      isLoading.value = true
      try {
        if (item.isMusic) {
          await removePlaylistMusic({
            ids: [item.data.id]
          })
        } else {
          await deletePlaylist({
            id: item.data.id
          })
        }

        item.parent.removeChild(item)
        window.$notify.success(t('msg.playlist-deleted'))
      } catch (e) {
        console.error(e)
      } finally {
        isLoading.value = false
      }
    }

    const playItem = async (item) => {
      if (!item || !item.isMusic) {
        return
      }
      let playIndex = 0
      const list = item.parent.children.filter(i => i.isMusic).map((i, index) => {
        const {data} = i
        if (data.id === item.data.id) {
          playIndex = index
        }
        return new MusicItem({
          ...data,
          filename: data.filename || data.file,
        })
      })

      store.commit('setPlayingList', list)
      bus.emit(ACTION_PLAY_START, {list, item: list[playIndex]})
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
      },
      playItem
    }
  }
})
</script>

<style lang="scss" scoped>
.list-playlist {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 5px 0;
  .tk-tree-item {
    .append {
      button {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        .material-icons {
          font-size: 20px;
        }
        &:hover {
          background: $secondary;
          border-radius: $generic-border-radius;
        }
      }
    }
  }
}
</style>
