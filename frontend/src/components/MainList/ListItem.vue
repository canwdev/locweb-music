<template>
  <TkButton
    class="list-item"
    :class="{
      'list-item--grey': !isSupport && !item.isDirectory,
      'list-item--active': active,
      'list-item--checkable': checkable,
      'list-item--checked': item.isChecked,
    }"
    size="no-style"
    :data-id="item.id"
    @contextmenu="handleContextMenu"
    @click.prevent="handleClick"
  >
    <div
      v-if="checkable"
      class="list-item__checkbox"
      @click.stop="handleCheck"
    >
      <TkSwitch
        :value="item.isChecked"
        checkbox
        size="sm"
      />
    </div>
    <div
      v-if="!isBigItem"
      class="list-item__inner"
    >
      <i class="left material-icons">{{ iconName }}</i>
      <span class="middle text-overflow">{{ item.filename }}</span>
      <TkButton
        v-if="isShowAction"
        size="no-style"
        class="right"
        @click.stop.prevent="$emit('onAction', item)"
      ><i class="material-icons">more_vert</i></TkButton>
    </div>
    <div
      v-else
      class="list-item__inner list-item__inner--big flex"
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
        v-if="isShowAction"
        size="no-style"
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
    checkable: {
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
    },
    handleCheck() {
      if (!this.checkable) {
        return
      }
      this.$emit('onCheck', this.item)
    },
    handleClick(event) {
      if (event.ctrlKey) {
        this.handleCheck()
        return
      }
      this.$emit('onClick', this.item)
    }
  },
}
</script>

<style lang="scss" scoped>
$active-color: $primary;

.list-item {
  display: block;
  text-decoration: none;
  color: inherit;
  text-align: left;
  width: 100%;
  border-radius: 0;
  position: relative;

  //&:hover {
  //  background-color: rgba(0, 0, 0, 0.08);
  //}

  &--active {
    .list-item__inner {
      background-color: $active-color;
      color: white;
    }

    .list-item__inner--big {
      background-color: $active-color;
      color: white;

      .btn-cover {
      }
    }
  }
  //&:nth-child(even) {
  //  background-color: rgba(0, 0, 0, 0.05);
  //}

  &--grey {
    color: grey;
  }

  &--checked {
    background-color: $primary-opacity;
  }

  &__checkbox {
    position: absolute;
    left: 5px;
    bottom: 2px;
    z-index: 10;
  }

  &__inner {
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

  &__inner--big {
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
