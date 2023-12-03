<script lang="ts">
import {defineComponent} from 'vue'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'

export default defineComponent({
  name: 'HomeView',
  components: {ViewPortWindow},
})
</script>

<template>
  <div class="home-view">
    <ViewPortWindow visible wid="1">Home</ViewPortWindow>
    <ViewPortWindow visible wid="2">Home2</ViewPortWindow>
  </div>
</template>

<style lang="scss" scoped>
.home-view {
  width: 100%;
  height: 100%;
}
</style>
