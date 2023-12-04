<script lang="ts">
import {defineComponent} from 'vue'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import FileManager from '@/components/FileManager/FileManager.vue'
import PlayerCore from '@/components/MusicPlayer/PlayerCore.vue'
import MusicDetail from '@/components/MusicPlayer/MusicDetail.vue'
import MusicControl from '@/components/MusicPlayer/MusicControl.vue'

export default defineComponent({
  name: 'HomeView',
  components: {MusicControl, MusicDetail, PlayerCore, FileManager, ViewPortWindow},
})
</script>

<template>
  <div class="home-view">
    <ViewPortWindow visible wid="fm">
      <template #titleBarLeft>File Manager</template>
      <FileManager />
    </ViewPortWindow>
    <ViewPortWindow visible wid="player">
      <template #titleBarLeft>Music Player</template>
      <div class="music-player-wrap">
        <div class="music-above">
          <MusicDetail />
          <PlayerCore />
        </div>
        <div class="music-below">
          <MusicControl />
        </div>
      </div>
    </ViewPortWindow>
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  width: 100%;
  height: 100%;

  .music-player-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    .music-above {
      flex: 1;
    }
    .music-below {
      height: 75px;
    }
  }
}
</style>
