<script lang="ts">
import {defineComponent} from 'vue'
import DesktopWallpaper from '@/components/OS/DesktopWindowManager/DesktopWallpaper.vue'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import {useSystemStore} from '@/store/system'

export default defineComponent({
  name: 'DesktopWindowManager',
  components: {ViewPortWindow, DesktopWallpaper},
  setup() {
    const systemStore = useSystemStore()
    const vpWindowRefs = ref()

    watch(
      () => systemStore.tasks,
      (list) => {
        setTimeout(() => {
          // 给每一个任务设置窗口ref
          list.forEach((i: TaskItem, index) => {
            if (!i.windowRef) {
              i.windowRef = vpWindowRefs.value[index]
            }
          })
        })
      }
    )

    return {
      systemStore,
      vpWindowRefs,
    }
  },
})
</script>

<template>
  <div class="desktop-window-manager">
    <DesktopWallpaper />

    <ViewPortWindow
      ref="vpWindowRefs"
      @onActive="systemStore.setTaskActive(item)"
      @onClose="systemStore.closeTask(item.guid)"
      v-for="item in systemStore.tasks"
      :key="item.guid"
      visible
      :init-win-options="item.winOptions"
    >
      <template #titleBarLeft>
        <span>{{ item.title }} {{ item.guid }}</span>
      </template>
    </ViewPortWindow>

    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.desktop-window-manager {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
  overflow: hidden;
  user-select: none;
}
</style>
