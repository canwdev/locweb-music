<template>
  <div class="home">
    <Navbar/>
    <HomeList
      :list="musicList"
    />
    <Actionbar/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '@/components/Navbar.vue';
import HomeList from '@/components/HomeList.vue';
import Actionbar from '@/components/Actionbar.vue';
import {getList} from "@/api/music";

export default defineComponent({
  name: 'Home',
  components: {
    Navbar,
    HomeList,
    Actionbar
  },
  data() {
    return {
      musicList: []
    }
  },
  mounted() {
    getList().then(res => {
      this.musicList = res.files
    })
  }
});
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>
