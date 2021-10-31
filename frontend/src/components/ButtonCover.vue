<template>
  <TkButton
    class="btn-cover flex items-center justify-center"
  >
    <slot></slot>
    <CoverDisplay v-if="src" :src="src"/>
    <i v-else class="material-icons">{{ iconName }}</i>
  </TkButton>
</template>

<script>
import CoverDisplay from '@/components/CoverDisplay.vue'

export default {
  name: 'ButtonCover',
  components: {
    CoverDisplay
  },
  props: {
    iconName: {
      type: String,
      default: 'audiotrack' // headset
    },
    src: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-cover {
  width: 50px;
  height: 50px;
  background: $primary;
  color: white;
  font-size: 28px;
  border-radius: $border-radius;
  overflow: hidden;
  .cover-display {
    width: 100%;
    height: 100%;
    background: $dark;
  }
  .material-icons {
    font-size: 29px;
  }
}
</style>
