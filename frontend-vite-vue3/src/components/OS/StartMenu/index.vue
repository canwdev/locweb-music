<script lang="ts">
import {defineComponent} from 'vue'
import StartMenuItem from '@/components/OS/StartMenu/StartMenuItem.vue'
import {ShortcutItem, StartMenuAppList, SystemAppList} from '@/enum/os'
import {useSystemStore} from '@/store/system'
import {useModelWrapper} from '@/hooks/use-model-wrapper'

export default defineComponent({
  name: 'StartMenu',
  components: {StartMenuItem},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, {emit}) {
    const mVisible = useModelWrapper(props, emit, 'visible')
    const systemStore = useSystemStore()

    const handleItemClick = (item: ShortcutItem) => {
      mVisible.value = false
      // TODO: run real components
      if (item.name === 'Run...') {
        systemStore.createTask()
      }
    }

    return {
      mVisible,
      systemStore,
      StartMenuAppList,
      SystemAppList,
      handleItemClick,
      handlePowerMenu() {
        location.reload()
      },
    }
  },
})
</script>

<template>
  <div v-show="mVisible" class="start-menu">
    <div class="start-menu-row">
      <div class="start-menu-left">
        <div class="program-list themed-field">
          <div class="shortcut-list">
            <StartMenuItem
              :item="item"
              v-for="(item, index) in StartMenuAppList"
              :key="index"
              @click="handleItemClick(item)"
            />
          </div>
        </div>
      </div>
      <div class="start-menu-right">
        <div class="shortcut-list">
          <StartMenuItem
            :item="item"
            v-for="(item, index) in SystemAppList"
            :key="index"
            @click="handleItemClick(item)"
          />
        </div>
      </div>
    </div>
    <div class="start-menu-row start-menu-bottom">
      <div class="start-menu-left">
        <input disabled placeholder="Search apps" class="input-search themed-field" />
      </div>
      <div class="start-menu-right">
        <button class="btn-no-style" @click="handlePowerMenu">Restart</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.start-menu {
  width: 400px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
  position: absolute;
  bottom: 100%;
  user-select: none;

  .start-menu-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 8px;

    .start-menu-left {
      flex: 1;
    }

    .start-menu-right {
      width: 150px;
      margin-left: 10px;
      button {
        padding: 4px 10px;
        font-size: 14px;
      }
    }
  }

  .program-list {
    border: 1px solid;
    padding: 2px;
    background-color: #fff;
    min-height: 300px;
  }

  .shortcut-list {
  }

  .shortcut-split {
    margin-top: 5px;
    margin-bottom: 5px;
    border-top: 1px solid $color_border;
  }

  .start-menu-bottom {
    border-top: 1px solid $color_border;
  }

  .input-search {
    box-sizing: border-box;
    width: 100%;
    font-size: 12px;
    padding: 3px 5px;
  }
}
</style>
