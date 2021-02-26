<template>
  <a
      :ref="setItemRef"
      class="btn-no-style list-item-wrap"
      :class="{grey: !isSupport && !item.isDirectory, active}"
  >
    <div
        v-if="!isBigItem"
        class="list-item"
    >
      <i class="material-icons">{{ iconName }}</i>
      <span class="text-overflow">{{ item.filename }}</span>
    </div>
    <div
        v-else
        class="list-item-big flex"
    >
      <ButtonCover
          :icon-name="iconName"
          :src="coverImage"
      />
      <div class="right">
        <div class="text-overflow filename">{{ item.filename }}</div>
        <div class="text-overflow display-title">{{ displayTitle }}</div>
      </div>
    </div>

  </a>
</template>

<script lang="ts">
import {defineComponent, toRefs, computed} from 'vue';
import {isSupportedMusicFormat} from "@/utils/is";
import ButtonCover from "@/components/ButtonCover.vue"
import useCoverImage from "@/composables/useCoverImage";

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
  },
  setup(props) {
    let itemEl
    const setItemRef = (el) => {
      itemEl = el
    }

    const {item, active, isBigItem, isPaused} = toRefs(props)

    const {coverImage} = useCoverImage(item)

    const isSupport = computed(() => {
      return isSupportedMusicFormat(item.value.filename)
    })

    const iconName = computed(() => {
      if (active.value) {
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
      return [title,artist,album].join(' - ')
    })

    const scrollIntoView = () => {
      if (itemEl) {
        itemEl.scrollIntoView({
          behavior: 'smooth'
        })
      }
    }
    // watch(active, (val) => {
    //   if (val) {
    //     // console.log('active', item.value, itemEl)
    //     setTimeout(() => {
    //       scrollIntoView()
    //     }, 200)
    //
    //   }
    // }, {
    //   immediate: true
    // })

    return {
      coverImage,
      isSupport,
      iconName,
      displayTitle,
      setItemRef,
      scrollIntoView
    }
  }
})
</script>

<style lang="scss" scoped>
.list-item-wrap {
  display: block;

  //&:hover {
  //  background: rgba(0, 0, 0, 0.08);
  //}

  &:active {
    background: rgba(0, 0, 0, 0.18);
  }

  &.active {
    .list-item {
      color: $accent;
    }

    .list-item-big {
      background: rgba(0, 0, 0, 0.1);
      .btn-cover {
        background-color: $primary;
      }
    }
  }

  & + .list-item-wrap {
    border-top: $layout-border;
  }

  //&:nth-child(odd) {
  //  background: rgba(0, 0, 0, 0.08);
  //}


  &.grey {
    color: $grey;
  }

  .list-item {
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;

    .material-icons {
      margin-right: 5px;
    }

    padding: 0 10px;
    height: 40px;
  }

  .list-item-big {
    height: 55px;
    display: flex;
    align-items: center;
    padding-left: 4px;

    .right {
      overflow: hidden;
      flex: 1;
      margin-left: 10px;

      .filename {
        margin-bottom: 5px;
      }

      .display-title {
        opacity: .5;
      }
    }
  }
}


</style>
