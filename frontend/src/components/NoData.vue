<template>
  <div v-show="visible" class="no-data">
    <img src="@/assets/images/no-data.png" alt="No data!">
    <div v-if="text" class="text">{{ text }}</div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: "NoData",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: null
    }
  }
})
</script>

<style lang="scss" scoped>
.no-data {
  width: 100%;
  text-align: center;
  padding: 50px 0;

  .text {
    color: $primary;
    padding-top: 10px;
    font-size: 16px;
  }
}
</style>
