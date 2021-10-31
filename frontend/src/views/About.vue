<template>
  <div class="about">
    <div class="container">
      <div class="title-wrap flex items-center justify-between">
        <span class="title"> {{ $t('page.about') }}</span>
        <TkButton @click="backHome">{{ $t('back') }}</TkButton>
      </div>
      <textarea style="height: 130px" class="" readonly :value="pkgInfo"></textarea>
      <div class="title-wrap flex items-center justify-between">
        <span class="title"> {{ $t('changelog') }}</span>
      </div>
      <div class="changelog-content" v-html="changelog"></div>
    </div>
  </div>
</template>

<script>
import {getInfo} from "@/api/service";
import snarkdown from "snarkdown"

export default {
  name: 'About',
  data() {
    return {
      pkgInfo: '',
      changelog: ''
    }
  },
  mounted() {
    getInfo().then(res=> {
      console.log('res',res)
      // @ts-ignore
      this.pkgInfo = JSON.stringify(res.package, null, 2)
      // @ts-ignore
      this.changelog = snarkdown(res.changelog)
    })
  },
  methods: {
    backHome() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.about {
  box-sizing: border-box;
  padding: 10px;
  color: $primary;
  height: 100%;
  overflow: auto;

  .title-wrap {
    margin: 10px 0;
  }
  .title {
    font-size: 30px;
  }
  textarea {
    width: 95%;
    min-height: 100px;
    resize: none;
    font-size: 14px;
    font-family: 'Consolas', monospace;
    color: $secondary;
    background: $dark;
    padding: 10px;
    overflow: auto;
    border-radius: 4px;
  }
  .container {
    max-width: 500px;
    margin: 0 auto;
  }
  .changelog-content {
    user-select: text;
  }
}
</style>
