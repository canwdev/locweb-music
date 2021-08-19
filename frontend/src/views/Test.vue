<template>
  <div class="test-page" :class="themeClass">
    <div class="container">
      <h1>TestPage</h1>

      <div class="block-gap-1">
        <button class="btn-styled" @click="testDialog = true">Show Dialog</button>
        <button class="btn-styled" @click="testDialog = true">Show Toast</button>
      </div>
      <DialogPrompt v-model:visible="testDialog"></DialogPrompt>

    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, computed} from 'vue';
import DialogPrompt from "@/components/DialogPrompt/index.vue";
import store from "@/store";

export default defineComponent({
  name: 'Home',
  components: {
    DialogPrompt
  },
  setup() {
    return {
      themeClass: computed(() => store.getters.themeClass)
    }
  },
  data() {
    return {
      testDialog: false
    }
  },
  methods: {
    backHome() {
      this.$router.back()
    }
  }
});
</script>

<style lang="scss" scoped>
.test-page {
  box-sizing: border-box;
  padding: 10px;
  color: $primary;
  height: 100%;
  overflow: auto;

}
</style>
