<template>
  <div class="about">
    <div class="title-wrap flex items-center">
      <button @click="backHome">Back</button>
      <span class="title"> About</span>
    </div>
    <textarea readonly :value="JSON.stringify(message, null, 2)"></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {getInfo} from "@/api/service";

export default defineComponent({
  name: 'Home',
  data() {
    return {
      message: null
    }
  },
  mounted() {
    getInfo().then(res=> {
      this.message = res
    })
  },
  methods: {
    backHome() {
      this.$router.back()
    }
  }
});
</script>

<style lang="scss" scoped>
.about {
  box-sizing: border-box;
  padding: 10px;
  color: $primary;
  background: $dark-page;
  height: 100%;

  .title-wrap {
    margin-bottom: 10px;
  }
  .title {
    margin-left: 10px;
    font-size: 30px;
  }
  textarea {
    width: 98%;
    height: 80vh;
    resize: none;
    font-size: 12px;
    font-family: monospace;
    color: inherit;
    background: inherit;
  }
}
</style>
