<template>
  <div class="home">
    <Navbar/>
    <HomeList
      :list="musicList"
      @onItemClick="handleItemClick"
    />
    <Actionbar/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '@/components/Navbar.vue';
import HomeList from '@/components/HomeList.vue';
import Actionbar from '@/components/Actionbar.vue';
import {getList} from "@/api/music.ts";
import {MusicItem} from "@/enum";
import bus, {
  ACTION_TOGGLE_PLAY,
} from "@/utils/bus";

export default defineComponent({
  name: 'Home',
  components: {
    Navbar,
    HomeList,
    Actionbar,
  },
  data() {
    return {
      musicList: []
    }
  },
  mounted() {
    getList().then(res => {
      this.musicList = res
    })
  },
  methods: {
    handleItemClick(item) {
      this.$store.commit('setCurrentMusic', new MusicItem({
        title: item,
        filepath: item
      }))
      bus.emit(ACTION_TOGGLE_PLAY)
    }
  }
});
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>
