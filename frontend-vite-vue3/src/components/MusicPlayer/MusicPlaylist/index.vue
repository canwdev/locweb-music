<script lang="ts">
import {defineComponent} from 'vue'
import PlaylistItem from '@/components/MusicPlayer/MusicPlaylist/PlaylistItem.vue'
import {useMusicStore} from '@/store/music'
import globalEventBus, {GlobalEvents} from '@/utils/bus'

export default defineComponent({
  name: 'MusicPlaylist',
  components: {PlaylistItem},
  setup() {
    const musicStore = useMusicStore()

    return {
      musicStore,
    }
  },
})
</script>

<template>
  <div class="music-play-list">
    <n-space class="playlist-action-bar">
      <n-input size="tiny" />
      {{ musicStore.playingIndex + 1 }} / {{ musicStore.playingList.length }}
    </n-space>
    <div class="music-list">
      <PlaylistItem
        v-for="item in musicStore.playingList"
        :key="item.guid"
        :item="item"
      ></PlaylistItem>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.music-play-list {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;

  .playlist-action-bar {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: white;
  }
}
</style>
