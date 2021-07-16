<template>
  <PlayerCore/>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import PlayerCore from '@/components/PlayerCore.vue';
import store from "@/store";
import {hexToRgb} from '@/utils/color'

export default defineComponent({
  name: 'App',
  components: {
    PlayerCore
  },
  setup() {
    const themeColor = computed(() => store.getters.themeColor)
    console.log('themeColor', themeColor.value)
    if (themeColor.value) {

      const colorHex = themeColor.value
      const {r, g, b} = hexToRgb(colorHex)

      const root = document.documentElement;
      root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
    }
  }
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
</style>
