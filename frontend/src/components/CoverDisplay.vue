<template>
  <div class="cover-display">
    <img :src="src">
  </div>
</template>

<script>
export default {
name: "CoverDisplay",
  props: {
    src: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.cover-display {
  position: relative;

  img {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
