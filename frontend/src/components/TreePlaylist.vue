<template>
  <div class="list-playlist">
    <TkTree
      :nodes="treeData"
      :selected-id="mSelected && mSelected.id"
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
        <TkButton v-if="!item.data.file" size="no-style" :title="$t('add')" @click="handleAdd(item)"><i
          class="material-icons"
        >add</i></TkButton>
        <TkButton v-else size="no-style" :title="$t('play')" @click="playItem(item)"><i class="material-icons">play_arrow</i>
        </TkButton>
        <TkButton v-if="item.parent" size="no-style" :title="$t('delete')" @click="handleDel(item)"><i
          class="material-icons"
        >delete</i></TkButton>
        <TkButton v-if="!item.data.file" size="no-style" :title="$t('refresh')" @click="item.$doLazyLoad()"><i
          class="material-icons"
        >refresh</i></TkButton>
        <TkButton size="no-style" :title="`id: ${item.id}\ndata-id: ${item.data.id}\n`" @click="logNode(item)"><i
          class="material-icons"
        >bug_report</i></TkButton>
      </template>
    </TkTree>

  </div>
</template>

<script>
import tankUI from '@canwdev/tank-ui'

const TreeNode = tankUI.enum.TreeNode

import {
  getPlaylist,
  createPlaylist,
  deletePlaylist,
  removePlaylistMusic
} from '@/api/playlist'
import bus, {ACTION_PLAY_START} from '@/utils/bus'
import {MusicItem} from '@/enum'

const root = new TreeNode({
  isLazy: true,
  data: {
    id: -1,
    title: '歌单',
  }
})

export default {
  name: 'TreePlaylist',
  props: {
    selected: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      treeData: root,
      self_selected: null,
      isLoading: false,
    }
  },
  computed: {
    mSelected: {
      get() {
        return this.selected || this.self_selected
      },
      set(val) {
        // console.log('mSelected', val)
        this.$emit('update:selected', val)
        this.$emit('onSelect', val)
        this.self_selected = val
      }
    }
  },
  methods: {
    handleNodeClick(node) {
      this.mSelected = node
    },
    async handleLazyLoad({node, done, fail}) {
      try {
        const {list = [], musics = []} = await getPlaylist({
          pid: node.data.id
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
    },
    async handleAdd(node) {
      try {
        const pid = node.data.id
        const title = prompt(`Add Playlist under ${pid}`, 'Playlist' + Date.now())
        if (!title) {
          return
        }
        this.isLoading = true
        const res = await createPlaylist({
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
        this.isLoading = false
      }
    },
    async handleDel(item) {
      if (!item.parent) {
        return
      }
      let confirmMsg = `WARNING!! Delete Playlist《${item.data.title}》 and its sub?`
      if (item.data.file) {
        confirmMsg = `WARNING!! Remove《${item.data.title}》?`
      }
      const flag = confirm(confirmMsg)
      if (!flag) {
        return
      }
      this.isLoading = true
      try {
        if (item.data.file) {
          await removePlaylistMusic({
            ids: [item.data.id]
          })
        } else {
          await deletePlaylist({
            id: item.data.id
          })
        }

        item.parent.removeChild(item)
        this.$toast.success(this.$t('msg.playlist-deleted'))
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    async playItem(item) {
      if (!item || !item.data.file) {
        return
      }
      let playIndex = 0
      const list = item.parent.children.filter(i => i.data.file).map((i, index) => {
        const {data} = i
        if (data.id === item.data.id) {
          playIndex = index
        }
        return new MusicItem({
          ...data,
          filename: data.filename || data.file,
        })
      })

      this.$store.commit('setPlayingList', list)
      bus.$emit(ACTION_PLAY_START, {list, item: list[playIndex]})
    },
    logNode(n) {
      console.log(n)
    }
  }
}
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
          border-radius: $border-radius;
        }
      }
    }
  }
}
</style>
