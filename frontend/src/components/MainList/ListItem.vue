<template>
  <a
      class="btn-no-style list-item-wrap"
      :class="{grey: !isSupport && !item.isDirectory, active}"
      :href="item.getSource()"
      @contextmenu="handleContextMenu"
  >
    <div
        v-if="!isBigItem"
        class="list-item"
    >
      <i class="left material-icons">{{ iconName }}</i>
      <span class="middle text-overflow">{{ item.filename }}</span>
      <button v-if="isShowAction"
            class="right btn-no-style"
            @click.stop.prevent="$emit('onAction', item)"
      ><i class="material-icons">more_vert</i></button>
    </div>
    <div
        v-else
        class="list-item-big flex"
    >
      <ButtonCover
          :icon-name="iconName"
          :src="coverImage"
      />
      <div class="middle">
        <div class="text-overflow filename">{{ item.filename }}</div>
        <div class="text-overflow display-title">{{ displayTitle }}</div>
      </div>
      <button
          v-if="isShowAction"
          class="right btn-no-style"
          @click.stop.prevent="$emit('onAction', item)"
      >
        <i class="material-icons">more_vert</i>
      </button>
    </div>

  </a>
</template>

<script lang="ts">
import {defineComponent, toRefs, computed} from 'vue';
import {isSupportedMusicFormat} from "@/utils/is";
import ButtonCover from "@/components/ButtonCover.vue"
import store from "@/store";

export default defineComponent({
  name: "ListItem",
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
  setup(props, context) {

    const {item, active, isBigItem, isPaused, isShowAction} = toRefs(props)

    const coverImage = computed(() => {
      return item.value.cover
    })

    const isSupport = computed(() => {
      return isSupportedMusicFormat(item.value.filename)
    })

    const iconName = computed(() => {
      if (isBigItem.value && active.value) {
        return isPaused.value ? 'pause' : 'play_arrow'
      }
      if (item.value.isDirectory) {
        return 'folder'
      }
      if (isSupport.value) {
        return 'audiotrack'
      }
      return 'insert_drive_file'
    })

    const displayTitle = computed(() => {
      const musicItem = item.value
      if (!isBigItem.value || !musicItem) {
        return ''
      }
      const {
        title,
        artist,
        album
      } = musicItem
      return [title, artist, album].join(' - ')
    })

    const handleContextMenu = (event) => {
      event.preventDefault()
      isShowAction.value && context.emit('onAction', item.value)
    }

    return {
      coverImage,
      isSupport,
      iconName,
      displayTitle,
      handleContextMenu
    }
  }
})
</script>

<style lang="scss" scoped>
$active-color: $primary;

.list-item-wrap {
  display: block;

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
        background-color: white;
        color: $active-color;
      }
    }
  }

  //& + .list-item-wrap {
  //  border-top: $layout-border;
  //}

  //&:nth-child(even) {
  //  background: rgba(0, 0, 0, 0.05);
  //}


  &.grey {
    color: $grey;
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
