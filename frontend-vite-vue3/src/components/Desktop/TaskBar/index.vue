<script lang="ts">
import {defineComponent} from 'vue'
import TrayClock from '@/components/Desktop/TaskBar/TrayClock.vue'

export default defineComponent({
  name: 'TaskBar',
  components: {TrayClock},
  methods: {TrayClock},
  setup() {
    const isShowStart = ref(false)
    const taskList = ref([])
    return {
      isShowStart,
      taskList,
    }
  },
})
</script>

<template>
  <div class="canos-task-bar">
    <div class="task-bar-container">
      <div class="task-start-menu _fc">
        <button class="btn-no-style" @click="isShowStart = !isShowStart">Start</button>
        <button class="btn-no-style start-button themed-frame">+</button>
      </div>
      <div class="task-list _fc">
        <div v-for="item in taskList" :key="item.guid">
          <button class="btn-no-style">
            <img :src="item.icon" :alt="item.title" class="task-icon" /> {{ item.title }}
          </button>
          <button class="btn-no-style btn-close">✕</button>
        </div>
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
    padding: 0 2px;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);

    ._fc {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .task-start-menu {
      .start-button {
        padding: 4px 10px;
      }
    }

    .task-list {
      flex: 1;
      padding-left: 5px;
      padding-right: 5px;

      .task-item {
        padding: 4px 10px 4px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 200px;
        position: relative;

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

        & + .task-item {
          margin-left: 5px;
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
