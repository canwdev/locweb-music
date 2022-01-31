<template>
  <div id="app" class="tk-scroll" :class="[isDarkTheme ? 'tk-dark-theme' : 'tk-light-theme']">
    <PlayerCore/>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import {getSystemDarkMode, hexToRgb} from '@/utils/color'
import PlayerCore from '@/components/PlayerCore.vue'
import {mapGetters} from 'vuex'

export default {
  components: {
    PlayerCore
  },
  computed: {
    ...mapGetters([
      'themeColor',
      'useSystemTheme',
    ]),
    isDarkTheme: {
      get() {
        if (this.useSystemTheme) {
          return getSystemDarkMode()
        }
        return this.$store.getters.isDarkTheme
      }
    },
  },
  created() {
  },
  watch: {
    themeColor() {
      this.updateThemeColor()
    },
  },
  mounted() {
    this.updateThemeColor()
  },
  methods: {
    updateThemeColor() {
      const {themeColor} = this
      // console.log({themeColor})
      if (themeColor) {
        const {r, g, b} = hexToRgb(themeColor)
        const root = document.documentElement
        root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`)
      }
    }
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
