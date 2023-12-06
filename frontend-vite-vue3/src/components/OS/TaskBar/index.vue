<script lang="ts">
import {defineComponent} from 'vue'
import TrayClock from '@/components/OS/TaskBar/TrayClock.vue'
import StartMenu from '@/components/OS/StartMenu/index.vue'
import {useSystemStore} from '@/store/system'

export default defineComponent({
  name: 'TaskBar',
  components: {StartMenu, TrayClock},
  setup() {
    const systemStore = useSystemStore()
    const isShowStart = ref(false)
    const taskList = ref([])
    return {
      isShowStart,
      taskList,
      systemStore,
    }
  },
})
</script>

<template>
  <div class="canos-task-bar">
    <transition name="fade">
      <StartMenu v-model:visible="isShowStart" />
    </transition>
    <div class="task-bar-container">
      <div class="task-start-menu _fc">
        <button class="start-button btn-no-style" @click="isShowStart = !isShowStart">Start</button>
        <!--        <button class="start-button btn-no-style" @click="systemStore.createTask()">+</button>-->
      </div>
      <div class="task-list _fc">
        <button
          class="btn-no-style task-item"
          v-for="item in systemStore.tasks"
          :key="item.guid"
          :class="{active: item.guid === systemStore.activeId}"
          @click="systemStore.setTaskActive(item)"
        >
          <span class="text-overflow">
            <img v-if="item.icon" :src="item.icon" :alt="item.title" class="task-icon" />
            {{ item.title }}
          </span>
          <!--          <span class="btn-close" @click="systemStore.closeTask(item.guid)">✕</span>-->
        </button>
      </div>
      <div class="task-tray _fc">
        <div class="tray-list themed-field _fc">
          <TrayClock />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.canos-task-bar {
  position: fixed;
  bottom: 0px;
  left: 0;
  right: 0;
  height: 34px;
  font-size: 14px;
  user-select: none;
  z-index: 100;

  .task-bar-container {
    height: 100%;
    width: 100%;
    display: flex;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);

    ._fc {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .task-start-menu {
      display: flex;
      gap: 2px;
      .start-button {
        height: 100%;
        padding: 2px 10px;
        background-color: $color_theme;
        color: white;
      }
    }

    .task-list {
      flex: 1;
      padding-left: 5px;
      padding-right: 5px;
      display: flex;
      gap: 2px;
      flex-wrap: wrap;
      overflow-y: auto;

      .task-item {
        height: 100%;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        background-color: rgba(255, 255, 255, 0.32);
        max-width: 200px;
        overflow: hidden;
        transition: all 0.3s;

        &:hover {
          background-color: white;
        }

        &::after {
          position: absolute;
          content: '';
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: $color_theme;
          visibility: hidden;
          opacity: 0;
          transition: all 0.1s;
        }

        &.active {
          &::after {
            visibility: visible;
            opacity: 1;
          }
        }

        .task-icon {
          position: absolute;
          width: 16px;
          height: 16px;
          left: 4px;
          pointer-events: none;
        }

        .btn-close {
          margin-left: 10px;
          display: inline-block;

          &:hover {
            color: red;
          }
        }
      }
    }

    .task-tray {
      .tray-list {
        height: 75%;
        padding: 0 5px;
      }
    }
  }
}
</style>
