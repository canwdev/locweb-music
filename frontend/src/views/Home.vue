<template>
  <div class="home bg-dark">
    <Navbar/>

    <ListFilesystem
        class="left-panel"
        v-show="!isPlayingList"
    />
    <ListPlaying
        class="right-panel"
        v-show="isPlayingList"
    />

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
import {NavbarTabsEnum} from "@/enum";

export default defineComponent({
  name: 'Home',
  components: {
    Navbar,
    Actionbar,
    ListFilesystem,
    ListPlaying
  },
  setup() {
    const navbarTab = computed(() => store.getters.navbarTab)
    const isPlayingList = computed(() => store.getters.navbarTab === NavbarTabsEnum.PLAYING)


    return {
      navbarTab,
      isPlayingList,
    }
  },
});
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  @media screen and (max-width: $mobile_width) {
    //background: linear-gradient(to bottom, rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)), url('~@/assets/images/bg.jpg') no-repeat center/cover;
  }
  @media screen and (min-width: $tablet_width) {
    ::deep .main-list {
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
