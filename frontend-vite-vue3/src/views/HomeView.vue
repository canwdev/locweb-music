<script lang="ts">
import {defineComponent} from 'vue'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import FileManager from '@/components/Apps/FileManager/FileManager.vue'
import TaskBar from '@/components/OS/TaskBar/index.vue'
import MusicPlayer from '@/components/Apps/MusicPlayer/index.vue'
import DesktopWindowManager from '@/components/OS/DesktopWindowManager/index.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    DesktopWindowManager,
    MusicPlayer,
    TaskBar,
    FileManager,
    ViewPortWindow,
  },
})
</script>

<template>
  <DesktopWindowManager>
    <!--    <ViewPortWindow visible wid="fm" style="min-height: 300px; min-width: 800px">-->
    <!--      <template #titleBarLeft>File Manager</template>-->
    <!--      <FileManager />-->
    <!--    </ViewPortWindow>-->
    <!--    <ViewPortWindow visible wid="player" style="min-height: 600px; min-width: 500px">-->
    <!--      <template #titleBarLeft>Music Player</template>-->
    <!--      <MusicPlayer />-->
    <!--    </ViewPortWindow>-->

    <TaskBar />
  </DesktopWindowManager>
</template>
