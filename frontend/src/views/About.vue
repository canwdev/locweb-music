<template>
  <div class="about">
    <h1>About</h1>
    <div>{{message}}</div>
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
  }
});
</script>
