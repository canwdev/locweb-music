<script lang="ts">
import {defineComponent} from 'vue'
import TaskBar from '@/components/OS/TaskBar/index.vue'
import DesktopWindowManager from '@/components/OS/DesktopWindowManager/index.vue'
import {useSystemStore} from '@/store/system'
import {AllAppList} from '@/enum/app'

export default defineComponent({
  name: 'HomeView',
  components: {
    DesktopWindowManager,
    TaskBar,
  },
  setup() {
    const systemStore = useSystemStore()
    onMounted(() => {
      AllAppList.forEach((item) => {
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
    <TaskBar />
  </DesktopWindowManager>
</template>
