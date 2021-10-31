<template>
  <div id="app" class="tk-scroll" :class="[isDarkTheme ? 'tk-dark-theme' : 'tk-light-theme']">
    <PlayerCore/>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import store from '@/store'
import {hexToRgb} from '@/utils/color'
import PlayerCore from '@/components/PlayerCore.vue'

export default {
  components: {
    PlayerCore
  },
  computed: {
    isDarkTheme: {
      get: () => store.getters.isDarkTheme
    },
  },
  created() {
    const themeColor = this.$store.getters.themeColor
    // console.log('themeColor', themeColor.value)
    if (themeColor) {
      const {r, g, b} = hexToRgb(themeColor)
      const root = document.documentElement
      root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`)
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  //border-radius: 8px;
  overflow: hidden;
  //user-select: none
}
</style>
