<template>
  <button
      class="btn-no-style btn-cover flex items-center justify-center">
    <i class="material-icons">{{ iconName }}</i>
  </button>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: "ButtonCover",
  props: {
    iconName: {
      type: String,
      default: "headset"
    }
  }
})
</script>

<style lang="scss" scoped>
.btn-cover {
  margin-left: 4px;
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
