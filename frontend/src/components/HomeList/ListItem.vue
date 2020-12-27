<template>
  <button
      class="btn-no-style list-item"
  >
    <i class="iconfont" :class="iconClass"></i>
    <span class="text-overflow">{{ item.name }}</span>
  </button>
</template>

<script lang="ts">
import {defineComponent, toRefs, computed} from 'vue';
import {isSupportedMusicFormat} from "@/utils/is";

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
    const isMusic = computed((): boolean => {
      if (item.value.isDirectory) {
        return false
      }
      return isSupportedMusicFormat(item.value.name)
    })

    const iconClass = computed(() => {
      if (item.value.isDirectory) {
        return 'icon-folder'
      }
      if (isMusic.value) {
        return 'icon-audiotrack'
      }
      return 'icon-insert-drive-file'
    })

    return {
      isMusic,
      iconClass
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

  //& + .list-item {
  //  border-top: $layout-border;
  //}
  &:nth-child(2n) {
    background: rgba(0, 0, 0, 0.1);
  }

  padding: 0 10px;
  height: 40px;
}
</style>
