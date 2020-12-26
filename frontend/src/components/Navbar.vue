<template>
  <div class="navbar flex flex-center">
    NavBar
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'NavBar',
});
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  background: $primary;
  color: #fff;
  height: 45px;
}
</style>
