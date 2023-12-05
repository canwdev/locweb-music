<script lang="ts">
import {defineComponent} from 'vue'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import FileManager from '@/components/FileManager/FileManager.vue'
import DesktopWallpaper from '@/components/Desktop/DesktopWallpaper.vue'
import TaskBar from '@/components/Desktop/TaskBar/index.vue'
import MusicPlayer from '@/components/MusicPlayer/index.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    MusicPlayer,
    TaskBar,
    DesktopWallpaper,
    FileManager,
    ViewPortWindow,
  },
})
</script>

<template>
  <div class="home-view">
    <DesktopWallpaper />
    <ViewPortWindow visible wid="fm" style="min-height: 300px; min-width: 800px">
      <template #titleBarLeft>File Manager</template>
      <FileManager />
    </ViewPortWindow>
    <ViewPortWindow visible wid="player" style="min-height: 600px; min-width: 500px">
      <template #titleBarLeft>Music Player</template>
      <MusicPlayer />
    </ViewPortWindow>

    <TaskBar />
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
