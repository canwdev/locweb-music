<template>
  <button
      :ref="setItemRef"
      class="btn-no-style list-item"
      :class="{grey: !isSupport && !item.isDirectory, active}"
  >
    <i class="material-icons">{{ iconName }}</i>
    <span class="text-overflow">{{ title }}</span>
  </button>
</template>

<script lang="ts">
import {defineComponent, toRefs, computed, watch} from 'vue';
import {isSupportedMusicFormat} from "@/utils/is";

export default defineComponent({
  name: "ListItem",
  props: {
    item: {
      type: Object,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },
  },
  setup(props) {
    let itemEl
    const setItemRef = (el) => {
      itemEl = el
    }

    const {item, active} = toRefs(props)
    watch(active, (val) => {
      if (val) {
        // console.log('active', item.value, itemEl)
        setTimeout(() => {
          if (itemEl) {
            itemEl.scrollIntoView({
              behavior: 'smooth'
            })
          }
        }, 200)

      }
    }, {
      immediate: true
    })

    const isSupport = computed(() => {
      return isSupportedMusicFormat(item.value.filename)
    })

    const iconName = computed(() => {
      if (active.value) {
        return 'play_arrow'
      }
      if (item.value.isDirectory) {
        return 'folder'
      }
      if (isSupport.value) {
        return 'audiotrack'
      }
      return 'insert_drive_file'
    })

    const title = computed(() => {
      if (!item.value) {
        return
      }
      return item.value.getDisplayTitle()
    })

    return {
      isSupport,
      iconName,
      title,
      setItemRef
    }
  }
})
</script>

<style lang="scss" scoped>
.list-item {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;

  &.active {
    color: $accent;
  }

  .material-icons {
    margin-right: 5px;
  }

  &.grey {
    color: $grey;
  }

  //& + .list-item {
  //  border-top: $layout-border;
  //}
  &:nth-child(odd) {
    background: rgba(0, 0, 0, 0.08);
  }

  padding: 0 10px;
  height: 40px;
}
</style>
