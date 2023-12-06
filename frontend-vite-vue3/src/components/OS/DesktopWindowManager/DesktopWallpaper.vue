<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'DesktopWallpaper',
})
</script>

<template>
  <div class="desktop-wallpaper">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.desktop-wallpaper {
  background-color: #3a6ea5;
  background-image: url('https://api.dujin.org/bing/1920.php');
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: white;
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.7);
}
</style>
