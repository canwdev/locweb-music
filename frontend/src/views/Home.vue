<template>
  <div class="home">
    <Navbar/>

    <FilesystemList
        v-show="!isPlayingList"
    />
    <PlayingList
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
import PlayingList from "@/components/PlayingList.vue";

import FilesystemList from "@/components/FilesystemList.vue";
import {NavbarTabsEnum} from "@/enum";

export default defineComponent({
  name: 'Home',
  components: {
    Navbar,
    Actionbar,
    FilesystemList,
    PlayingList
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
