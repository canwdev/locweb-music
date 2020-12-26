<template>
  <div class="home">
    <Navbar/>
    <HomeList/>
    <Actionbar/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '@/components/Navbar.vue';
import HomeList from '@/components/HomeList.vue';
import Actionbar from '@/components/Actionbar.vue';

export default defineComponent({
  name: 'Home',
  components: {
    Navbar,
    HomeList,
    Actionbar
  }
});
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>
