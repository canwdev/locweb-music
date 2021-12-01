<template>
  <TkButton
    class="list-item-wrap"
    :class="{_grey: !isSupport && !item.isDirectory, active}"
    size="no-style"
    @contextmenu="handleContextMenu"
    @click.prevent
  >
    <div
      v-if="!isBigItem"
      class="list-item"
    >
      <i class="left material-icons">{{ iconName }}</i>
      <span class="middle text-overflow">{{ item.filename }}</span>
      <TkButton
        size="no-style"
        v-if="isShowAction"
        class="right"
        @click.stop.prevent="$emit('onAction', item)"
      ><i class="material-icons">more_vert</i></TkButton>
    </div>
    <div
      v-else
      class="list-item-big flex"
      :title="item.filename"
    >
      <ButtonCover
        :icon-name="iconName"
        :src="coverImage"
      />
      <div class="middle">
        <div class="text-overflow filename">{{ item.title || item.filename }}</div>
        <div class="text-overflow display-title">{{ artistsAlbum }}</div>
      </div>
      <TkButton
        size="no-style"
        v-if="isShowAction"
        class="right"
        @click.stop.prevent="$emit('onAction', item)"
      >
        <i class="material-icons">more_vert</i>
      </TkButton>
    </div>
    <slot></slot>
  </TkButton>
</template>

<script>
import {isSupportedMusicFormat} from '@/utils/is'
import ButtonCover from '@/components/ButtonCover.vue'

export default {
  name: 'ListItem',
  components: {
    ButtonCover
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
    isBigItem: {
      type: Boolean,
      default: false
    },
    isPaused: {
      type: Boolean,
      default: false
    },
    isShowAction: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {
    coverImage() {
      return this.item.cover
    },
    isSupport() {
      return isSupportedMusicFormat(this.item.filename)
    },
    iconName() {
      if (this.isBigItem && this.active) {
        return this.isPaused ? 'pause' : 'play_arrow'
      }
      if (this.item.isDirectory) {
        return 'folder'
      }
      if (this.isSupport) {
        return 'audiotrack'
      }
      return 'insert_drive_file'
    },
    artistsAlbum() {
      const musicItem = this.item
      if (!this.isBigItem || !musicItem) {
        return ''
      }
      const {
        artist,
        album
      } = musicItem
      return [artist, album].join(' - ')
    }
  },
  methods: {
    handleContextMenu(event) {
      event.preventDefault()
      this.isShowAction && this.$emit('onAction', this.item)
    }
  },
}
</script>

<style lang="scss" scoped>
$active-color: $primary;

.list-item-wrap {
  display: block;
  text-decoration: none;
  color: inherit;
  text-align: left;
  width: 100%;
  border-radius: 0;

  //&:hover {
  //  background: rgba(0, 0, 0, 0.08);
  //}

  &.active {
    .list-item {
      background: $active-color;
      color: white;
    }

    .list-item-big {
      background: $active-color;
      color: white;

      .btn-cover {
      }
    }
  }

  //& + .list-item-wrap {
  //  border-top: $layout-border;
  //}

  //&:nth-child(even) {
  //  background: rgba(0, 0, 0, 0.05);
  //}

  &._grey {
    color: grey;
  }

  .list-item {
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding-left: 10px;
    height: 40px;

    .left {
      margin-right: 5px;
    }

    .middle {
      flex: 1;
    }

    .right {
      padding-left: 10px;
      padding-right: 10px;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }

  .list-item-big {
    height: 55px;
    display: flex;
    align-items: center;

    .btn-cover {
      width: 45px;
      height: 45px;
      margin: 0 5px;
    }

    .middle {
      overflow: hidden;
      flex: 1;

      .filename {
        margin-bottom: 5px;
      }

      .display-title {
        opacity: .5;
      }
    }

    .right {
      padding-left: 10px;
      padding-right: 10px;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
}
</style>
