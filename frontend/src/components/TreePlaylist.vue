<template>
  <div class="tree-playlist">
    <TkTree
      v-if="treeData"
      :nodes="treeData"
      :selected-id="mSelected && mSelected.id"
      @onItemClick="handleNodeClick"
      @onItemContextMenu="handleNodeContextMenu"
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
        <TkButton size="no-style" :title="$t('menu')" @click="showItemMenu(item)">
          <i class="material-icons">more_vert</i>
        </TkButton>
      </template>
    </TkTree>
    <ContextMenuCommon
      ref="itemMenuRef"
      :list-fn="getItemMenuList"
    />
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
import bus, {ACTION_PLAY_START, ACTION_TOGGLE_PLAY} from '@/utils/bus'
import {MusicItem} from '@/enum'
import ContextMenuCommon from '@/components/ContextMenuCommon'

const rootNode = new TreeNode({
  isLazy: true,
  data: {
    id: -1,
    title: '歌单',
  }
})

export default {
  name: 'TreePlaylist',
  components: {
    ContextMenuCommon
  },
  props: {
    selected: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      treeData: null,
      selfSelected: null,
      isLoading: false,
    }
  },
  computed: {
    mSelected: {
      get() {
        return this.selected || this.selfSelected
      },
      set(val) {
        // console.log('mSelected', val)
        this.$emit('update:selected', val)
        this.$emit('onSelect', val)
        this.selfSelected = val
      }
    }
  },
  mounted() {
    this.initRoot()
  },
  methods: {
    getItemMenuList(item) {
      const list = []

      if (!item.data.file) {
        list.push({icon: 'create_new_folder', label: this.$t('add'), action: () => this.handleAdd(item)})
        list.push({icon: 'refresh', label: this.$t('refresh'), action: () => item.$doLazyLoad()})
      } else {
        list.push({icon: 'play_arrow', label: this.$t('play'), action: () => this.playItem(item)})
      }

      if (item.parent) {
        list.push({icon: 'delete', label: this.$t('delete'), action: () => this.handleDel(item)})
      }

      list.push({isSeparator: true})
      list.push({
        icon: 'bug_report',
        label: `id: ${item.id}, data-id: ${item.data.id}`,
        action: () => this.logNode(item)
      })

      return list
    },
    initRoot() {
      this.handleLazyLoad({
        node: {data: {id: -1}},
        done: (list) => {
          if (list.length > 0) {
            this.treeData = list[0]
          } else {
            this.treeData = rootNode
          }
        },
        fail: (e) => {
          console.error(e)
        }
      })
    },
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
      const pid = node.data.id

      this.$prompt.create({
        propsData: {
          title: `Add Playlist`,
          content: `Add Playlist under ${pid}`,
          input: {
            value: '',
            required: true,
            placeholder: '',
          }
        },
        parentEl: this.$el
      }).onConfirm(async (context) => {
        try {
          this.isLoading = true
          const title = context.inputValue
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
      })
    },
    async handleDel(item) {
      if (!item.parent) {
        return
      }
      let confirmMsg = `WARNING!! Delete Playlist《${item.data.title}》 and its sub?`
      if (item.data.file) {
        confirmMsg = `WARNING!! Remove《${item.data.title}》?`
      }
      this.$prompt.create({
        propsData: {
          title: this.$t('delete'),
          content: confirmMsg,
        },
        parentEl: this.$el
      }).onConfirm(async () => {
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
      })
    },
    async playItem(item) {
      if (!item || !item.data.file) {
        return
      }
      console.log(item)
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
    },
    showItemMenu(item) {
      this.$refs.itemMenuRef.open(item)
    },
    handleNodeContextMenu({event, item}) {
      event.preventDefault()
      this.showItemMenu(item)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-playlist {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 5px 0;
  box-sizing: border-box;

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
          background: $primary;
          color: white;
        }
      }
    }
  }
}
</style>
