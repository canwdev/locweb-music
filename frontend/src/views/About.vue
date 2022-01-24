<template>
  <PageLayout
    :title="$t('page.about')"
    :back-text="$t('back')"
    class="about"
    @back="$router.back()"
  >
    <div class="about-main">
      <textarea style="height: 130px" class="" readonly :value="pkgInfo"></textarea>

      <div class="changelog-content">
        <div class="title-wrap">{{ $t('changelog') }}</div>
        <pre v-html="changelog"></pre>
      </div>

    </div>
  </PageLayout>
</template>

<script>
import {getInfo} from '@/api/service'
import PageLayout from '@/components/PageLayout'

export default {
  name: 'About',
  components: {
    PageLayout,
  },
  data() {
    return {
      pkgInfo: '',
      changelog: ''
    }
  },
  mounted() {
    getInfo().then(res => {
      this.pkgInfo = JSON.stringify(res.package, null, 2)
      this.changelog = res.changelog
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
.about-main {
  box-sizing: border-box;
  padding: 10px;
  color: $primary;
  height: 100%;
  overflow: auto;

  .title-wrap {
    margin: 10px 0;
    font-size: 18px;
  }

  textarea {
    width: 96%;
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
  .changelog-content {
    user-select: text;
    font-size: 14px;
  }
}
</style>
