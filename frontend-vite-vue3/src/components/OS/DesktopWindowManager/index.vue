<script lang="ts">
import {defineComponent} from 'vue'
import DesktopWallpaper from '@/components/OS/DesktopWindowManager/DesktopWallpaper.vue'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import {useSystemStore} from '@/store/system'
import {ArrowMaximize20Regular, ArrowMinimize20Regular, Subtract20Filled} from '@vicons/fluent'
import DesktopContent from '@/components/OS/DesktopWindowManager/DesktopContent.vue'

export default defineComponent({
  name: 'DesktopWindowManager',
  components: {
    DesktopContent,
    ViewPortWindow,
    DesktopWallpaper,
    ArrowMaximize20Regular,
    ArrowMinimize20Regular,
    Subtract20Filled,
  },
  setup() {
    const systemStore = useSystemStore()
    const vpWindowRefs = ref()
    const isMaximum = ref(false)

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
      isMaximum,
    }
  },
})
</script>

<template>
  <div class="desktop-window-manager">
    <DesktopWallpaper>
      <DesktopContent />
    </DesktopWallpaper>

    <template v-for="task in systemStore.tasks" :key="task.guid">
      <transition-group name="fade-scale">
        <ViewPortWindow
          ref="vpWindowRefs"
          @onActive="systemStore.setTaskActive(task)"
          @onClose="systemStore.closeTask(task.guid)"
          :visible="!task.minimized"
          :wid="task.winId"
          :init-win-options="task.winOptions"
          :maximum="isMaximum"
          :allow-move="!isMaximum"
          :transition-name="null"
          :key="task.guid"
          @onTitleBarDbclick="isMaximum = !isMaximum"
        >
          <template #titleBarLeft>
            <img class="window-icon" :src="task.icon" :alt="task.title" />
            <span>{{ task.title }}</span>
          </template>
          <template #titleBarRightControls>
            <button @click="task.minimized = true">
              <n-icon size="20">
                <Subtract20Filled />
              </n-icon>
            </button>
            <button @click="isMaximum = !isMaximum">
              <n-icon size="20">
                <ArrowMinimize20Regular v-if="isMaximum" />
                <ArrowMaximize20Regular v-else />
              </n-icon>
            </button>
          </template>

          <component v-if="task.component" :is="task.component"></component>
        </ViewPortWindow>
      </transition-group>
    </template>

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
