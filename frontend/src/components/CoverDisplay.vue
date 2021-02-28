<template>
  <div class="cover-display">
    <img v-if="src" :src="src" :class="{rounded: isRounded, rotating: isRotating}">
  </div>
</template>

<script>
export default {
name: "CoverDisplay",
  props: {
    src: {
      type: String,
      default: null
    },
    isRounded: {
      type: Boolean,
      default: false
    },
    isRotating: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.cover-display {
  position: relative;
  overflow: hidden;

  img {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: rotating360 60s infinite linear;
    animation-play-state: paused;
    border-radius: inherit;
    overflow: hidden;

    &.rounded {
      border-radius: 50%;
    }
    &.rotating {
      animation-play-state: running;
    }
  }
}
</style>
