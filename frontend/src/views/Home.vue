<template>
  <div class="home">
    <Navbar/>

    <div
      v-show="isLeftPanel"
      class="panel-item left-panel"
      @click="navbarIndex=NavBarIndex.LEFT"
    >
      <component
        :is="NavbarTabs[navbarTab].componentName"
      ></component>

    </div>
    <div
      v-show="!isLeftPanel"
      class="panel-item right-panel"
      @click="navbarIndex=NavBarIndex.RIGHT"
    >
      <ListPlaying/>
    </div>

    <Actionbar/>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Navbar from '@/components/Navbar.vue'
import Actionbar from '@/components/Actionbar.vue'
import ListPlaying from '@/components/ListPlaying/index.vue'
import {NavBarIndex, NavbarTabs, NavbarTabsType} from '@/enum'

// 动态引入子组件
const dynamicImportComponents = {}

for (const key in NavbarTabs) {
  const item = NavbarTabs[key]
  if (!item.componentName) {
    continue
  }
  dynamicImportComponents[item.componentName] = resolve => require([`@/components/${item.componentName}.vue`], resolve)
}

export default {
  name: 'Home',
  components: {
    Navbar,
    Actionbar,
    ListPlaying,
    ...dynamicImportComponents
  },
  data() {
    return {
      NavbarTabsType,
      NavbarTabs,
      NavBarIndex
    }
  },
  computed: {
    ...mapGetters([
      'navbarTab'
    ]),
    navbarIndex: {
      get() {
        return this.$store.state.navbarIndex
      },
      set(val) {
        return this.$store.commit('setNavbarIndex', val)
      }
    },
    isLeftPanel() {
      return this.navbarIndex === NavBarIndex.LEFT
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;

  .panel-item {
    position: absolute;
    overflow: hidden;
    top: $navbarHeight;
    left: 0;
    width: 100%;
    bottom: 75px;
    //padding: 45px 0 80px;
    //box-sizing: border-box;
  }

  @media screen and (max-width: $mq_mobile_width) {
    //background: linear-gradient(to bottom, rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)), url('~@/assets/images/bg.jpg') no-repeat center/cover;
  }
  @media screen and (min-width: $mq_tablet_width) {
    .panel-item {
      display: flex !important;
      width: 50%;

      &.right-panel {
        border-left: 1px solid $border-color;
        left: unset;
        right: 0;
      }
    }
  }
}
</style>
