<template>
  <div id="app" class="tk-scroll" :class="[isDarkTheme ? 'tk-dark-theme' : 'tk-light-theme']">
    <PlayerCore/>
    <keep-alive>
      <transition :name="transitionName">
        <router-view/>
      </transition>
    </keep-alive>
  </div>
</template>

<script>
import {getSystemDarkMode, hexToRgb} from '@/utils/color'
import PlayerCore from '@/components/PlayerCore.vue'
import {mapGetters} from 'vuex'
const getPathDepth = (path) => {
  if (path === '/') {
    return 0
  }
  return path.split('/').length
}

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
  data() {
    return {
      transitionName: ''
    }
  },
  watch: {
    themeColor() {
      this.updateThemeColor()
    },
    '$route' (to, from) {
      const toDepth = getPathDepth(to.path)
      const fromDepth = getPathDepth(from.path)
      this.transitionName = toDepth < fromDepth ? 'fade-up' : 'fade-down'
    }
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
