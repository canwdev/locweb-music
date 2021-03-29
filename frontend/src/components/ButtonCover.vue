<template>
  <button
      class="btn-no-style btn-cover flex items-center justify-center">
    <slot></slot>
    <CoverDisplay v-if="src" :src="src"/>
    <i v-else class="material-icons">{{ iconName }}</i>
  </button>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import CoverDisplay from '@/components/CoverDisplay.vue'

export default defineComponent({
  name: "ButtonCover",
  components: {
    CoverDisplay
  },
  props: {
    iconName: {
      type: String,
      default: "audiotrack" // headset
    },
    src: {
      type: String,
      default: null
    }
  }
})
</script>

<style lang="scss" scoped>
.btn-cover {
  width: 50px;
  height: 50px;
  background: $grey-6;
  color: white;
  font-size: 28px;
  border-radius: 4px;
  .material-icons {
    font-size: 29px;
  }
}
</style>
