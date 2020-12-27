<template>
  <button
      class="btn-no-style list-item"
      :class="{grey: !isSupport && !item.isDirectory}"
  >
    <i class="iconfont" :class="iconClass"></i>
    <span class="text-overflow">{{ title }}</span>
  </button>
</template>

<script lang="ts">
import {defineComponent, toRefs, computed} from 'vue';
import {isSupportedMusicFormat} from "@/utils/is";
import {MusicItem} from "@/enum";

export default defineComponent({
  name: "ListItem",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { item } = toRefs(props)

    const isSupport = computed(() => {
      return isSupportedMusicFormat(item.value.filename)
    })

    const iconClass = computed(() => {
      if (item.value.isDirectory) {
        return 'icon-folder'
      }
      if (isSupport.value) {
        return 'icon-audiotrack'
      }
      return 'icon-insert-drive-file'
    })

    const title = computed(() => {
      if (item.value.title) {
        return `${item.value.title} - ${item.value.author}`
      } else {
        return item.value.filename
      }
    })

    return {
      isSupport,
      iconClass,
      title
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

  .iconfont {
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
