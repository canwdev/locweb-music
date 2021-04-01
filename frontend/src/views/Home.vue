<template>
  <div class="home bg-dark">
    <Navbar/>

    <ListFilesystem
        v-show="!isPlayingList"
    />
    <ListPlaying
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
}
</style>
