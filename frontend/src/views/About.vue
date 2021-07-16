<template>
  <div class="about" :class="themeClass">
    <div class="container">
      <div class="title-wrap flex items-center justify-between">
        <span class="title"> About</span>
        <button class="btn-styled" @click="backHome">Back</button>
      </div>
      <textarea class="input-styled" readonly :value="pkgInfo"></textarea>
      <div class="title-wrap flex items-center justify-between">
        <span class="title"> Changelog</span>
      </div>
      <textarea class="input-styled" readonly :value="changelog"></textarea>
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
    const pkgInfo = ref('')
    const changelog = ref('')


    onMounted(() => {
      getInfo().then(res=> {
        console.log('res',res)
        // @ts-ignore
        pkgInfo.value = JSON.stringify(res.package, null, 2)
        // @ts-ignore
        changelog.value = res.changelog
      })
    })
    return {
      pkgInfo,
      changelog,
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
    margin: 10px 0;
  }
  .title {
    font-size: 30px;
  }
  textarea {
    width: 100%;
    min-height: 200px;
    resize: none;
    font-size: 14px;
    font-family: 'Consolas', monospace;
    color: $secondary;
    background: $dark;
    padding: 10px;
    overflow: hidden;
  }
  .container {
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
