<template>
  <div class="no-data">
    <img class="no-data-img" src="@/assets/images/Transparent_Akkarin.webp" alt="No data!">
    <div class="text">{{ text || $t('msg.no-data') }}</div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: "NoData",
  props: {
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

  .no-data-img {
    width: 160px;
    height: auto;
    border-radius: $generic-border-radius;
    opacity: .2;
  }

  .text {
    color: $primary;
    padding-top: 10px;
    font-size: 16px;
  }
}
</style>
