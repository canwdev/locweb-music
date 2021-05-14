<template>
  <div class="about" :class="themeClass">
    <div class="container">
      <div class="title-wrap flex items-center justify-between">
        <span class="title"> About</span>
        <button class="btn-styled" @click="backHome">Back</button>
      </div>
      <textarea readonly :value="JSON.stringify(message, null, 2)"></textarea>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, computed} from 'vue';
import {getInfo} from "@/api/service";
import store from "@/store";

export default defineComponent({
  name: 'Home',
  setup() {
    const message = ref<string|object>({})
    onMounted(() => {
      getInfo().then(res=> {
        console.log('res',res)
        message.value = res
      })
    })
    return {
      message,
      themeClass: computed(() => store.getters.themeClass)
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
.about {
  box-sizing: border-box;
  padding: 10px;
  color: $primary;
  height: 100%;

  .title-wrap {
    margin-bottom: 10px;
  }
  .title {
    font-size: 30px;
  }
  textarea {
    width: 98%;
    height: 300px;
    resize: none;
    font-size: 12px;
    font-family: monospace;
    color: inherit;
    background: inherit;
  }
  .container {
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
