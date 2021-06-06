<template>
  <div class="home" :class="themeClass">
    <Navbar/>

    <div
        class="panel-item left-panel"
        @click="navbarIndex=0"
        v-show="isLeftPanel"
    >
      <ListFilesystem
      />
    </div>
    <div
        class="panel-item right-panel"
        @click="navbarIndex=1"
        v-show="!isLeftPanel"
    >
      <ListPlaying
      />
    </div>

    <Actionbar/>


  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
} from 'vue';
import store from '@/store'

import Navbar from '@/components/Navbar.vue';
import Actionbar from '@/components/Actionbar.vue';
import ListPlaying from "@/components/ListPlaying.vue";
import ListFilesystem from "@/components/ListFilesystem.vue";
import {NavbarTabsType} from "@/enum";

export default defineComponent({
  name: 'Home',
  components: {
    Navbar,
    Actionbar,
    ListFilesystem,
    ListPlaying
  },
  setup() {
    const navbarTab = computed(() => store.state.navbarTab)

    const navbarIndex = computed({
      get() {
        return store.state.navbarIndex
      },
      set(val) {
        store.commit('setNavbarIndex', val)
      }
    })

    const isLeftPanel = computed(() => navbarIndex.value === 0)

    return {
      navbarTab,
      navbarIndex,
      isLeftPanel,
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
