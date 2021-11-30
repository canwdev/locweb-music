<template>
  <TkModalDialog
    v-model="mVisible"
    show-close
    fixed
  >
    <div class="tree-playlist-chooser settings-form">
      <div class="settings-title">
        <i v-if="titleIcon" class="title-icon material-icons">{{ titleIcon }}</i>
        {{ title }}
      </div>
      <div class="playlist-tree-wrap">
        <TreePlaylist
          v-if="mVisible"
          ref="treeRef"
          :selected.sync="selected"
        />
      </div>

      <div class="action-btn-row">
        <TkButton type="submit" @click="handleCancel">{{ $t('cancel') }}</TkButton>
        <TkButton type="submit" @click="handleSubmit">{{ $t('ok') }}</TkButton>
      </div>
    </div>

  </TkModalDialog>
</template>

<script>
import visibleMixin from '@/mixins/visible'
import TreePlaylist from '@/components/TreePlaylist'

export default {
  name: 'TreePlaylistChooser',
  mixins: [visibleMixin],
  components: {
    TreePlaylist
  },
  props: {
    title: {
      type: String,
      default: 'Choose Playlist'
    },
    titleIcon: {
      type: String,
      default: 'queue_music'
    }
  },
  data() {
    return {
      selected: null
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.selected)
      this.handleCancel()
    },
    handleCancel() {
      this.selected = null
      this.mVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-playlist-chooser {
  .playlist-tree-wrap {
    max-height: 60vh;
    padding: 0 10px;
  }
}
</style>
