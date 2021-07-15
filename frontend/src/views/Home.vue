<template>
  <div class="home" :class="themeClass">
    <Navbar/>

    <div
        class="panel-item left-panel"
        @click="navbarIndex=NavBarIndex.LEFT"
        v-show="isLeftPanel"
    >
      <component
          :is="NavbarTabs[navbarTab].componentName"
      ></component>

<!--      <ListFilesystem v-if="navbarTab === NavbarTabsType.MAIN"/>
      <ListPlaylist v-if="navbarTab === NavbarTabsType.PLAYLIST"/>-->
    </div>
    <div
        class="panel-item right-panel"
        @click="navbarIndex=NavBarIndex.RIGHT"
        v-show="!isLeftPanel"
    >
      <ListPlaying
      />
    </div>

    <Actionbar/>


  </div>
</template>

<script lang="ts">
import {computed, defineAsyncComponent, defineComponent,} from 'vue';
import store from '@/store'

import Navbar from '@/components/Navbar.vue';
import Actionbar from '@/components/Actionbar.vue';
import ListPlaying from "@/components/ListPlaying/index.vue";
// import ListPlaylist from "@/components/ListPlaylist.vue";
// import ListFilesystem from "@/components/ListFilesystem.vue";
import {NavBarIndex, NavbarTabs, NavbarTabsType} from "@/enum";

// Dynamic child components
const dynamicImportComponents = {}

for (const key in NavbarTabs) {
  const item = NavbarTabs[key]
  if (!item.componentName) {
    continue
  }
  dynamicImportComponents[item.componentName] = defineAsyncComponent(() =>
      import(`@/components/${item.componentName}.vue`)
  )
}

export default defineComponent({
  name: 'Home',
  components: {
    Navbar,
    Actionbar,
    ListPlaying,
    // ListFilesystem,
    // ListPlaylist,
    ...dynamicImportComponents
  },
  setup() {
    const navbarTab = computed(() => store.getters.navbarTab)

    const navbarIndex = computed({
      get() {
        return store.state.navbarIndex
      },
      set(val) {
        store.commit('setNavbarIndex', val)
      }
    })

    const isLeftPanel = computed(() => navbarIndex.value === NavBarIndex.LEFT)

    return {
      navbarTab,
      NavbarTabsType,
      NavbarTabs,
      navbarIndex,
      isLeftPanel,
      NavBarIndex,
      themeClass: computed(() => store.getters.themeClass)
    }
  },
});
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
  @media screen and (max-width: $mobile_width) {
    //background: linear-gradient(to bottom, rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)), url('~@/assets/images/bg.jpg') no-repeat center/cover;
  }
  @media screen and (min-width: $tablet_width) {
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
