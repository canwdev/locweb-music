<script lang="ts">
import {defineComponent} from 'vue'
import TaskBar from '@/components/OS/TaskBar/index.vue'
import DesktopWindowManager from '@/components/OS/DesktopWindowManager/index.vue'
import {StartMenuAppList} from '@/enum/os'
import {useSystemStore} from '@/store/system'

export default defineComponent({
  name: 'HomeView',
  components: {
    DesktopWindowManager,
    TaskBar,
  },
  setup() {
    const systemStore = useSystemStore()
    onMounted(() => {
      StartMenuAppList.forEach((item) => {
        if (item.autostart) {
          systemStore.createTask(item)
        }
      })
    })

    onBeforeUnmount(() => {
      systemStore.shutdown()
    })
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
