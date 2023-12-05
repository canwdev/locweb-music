<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {MusicItem} from '@/enum/music'

export default defineComponent({
  name: 'PlaylistItem',
  props: {
    item: {
      type: Object as PropType<MusicItem>,
      required: true,
    },
  },
})
</script>

<template>
  <div class="playlist-item">{{ item }}</div>
</template>

<style lang="scss" scoped>
.playlist-item {
  padding: 10px;
  word-break: break-word;

  & + .playlist-item {
    border-top: 1px solid;
  }
}
</style>
