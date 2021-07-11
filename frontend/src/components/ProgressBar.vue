<template>
  <div class="tk-progress-bar">
    <div v-if="progress > 0" class="progress" :style="{width: progress + '%'}"></div>
  </div>
</template>

<script>
import {defineComponent, ref} from 'vue'

export default defineComponent({
  name: "ProgressBar",
  props: {
    progress: {
      type: [Number, String],
      default: 0
    }
  }
})
</script>

<style lang="scss" scoped>
.tk-progress-bar {
  position: relative;
  overflow: hidden;
  height: 5px;
  width: 100%;
  background: $border-color;
  border-radius: $generic-border-radius;

  .progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0;
    transition: all .3s;
    background: $primary;
  }
}
</style>
