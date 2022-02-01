<template>
  <PageLayout
    :title="$t('page.about')"
    :back-text="$t('back')"
    class="about-page"
    @back="$router.back()"
  >
    <Settings :settings-list="aboutList"/>

  </PageLayout>
</template>

<script>
import {getInfo} from '@/api/service'
import PageLayout from '@/components/PageLayout'
import Settings from '@/components/Settings'

export default {
  name: 'About',
  components: {
    PageLayout,
    Settings,
  },
  data() {
    return {
      pkgInfo: '',
      changelog: '',
      aboutList: []
    }
  },
  mounted() {
    getInfo().then(res => {
      const {package: pkg, changelog} = res
      const packageInfos = []
      for (let key in pkg) {
        packageInfos.push({
          id: key,
          default: pkg[key]
        })
      }
      this.aboutList = [
        {
          title: 'package',
          children: packageInfos
        },
        {
          title: this.$t('changelog'),
          children: [{
            id: 'changelog',
            default: changelog,
            className: 'changelog-item'
          }]
        }
      ]

      this.pkgInfo = JSON.stringify(pkg, null, 2)
      this.changelog = changelog
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
.about-page {
  ::v-deep .changelog-item {
    margin-top: 10px;

    .settings-item__left {
      flex: unset;
      width: auto;
    }

    .settings-item__titles__title {
      display: none;
    }

    .current-value {
      text-align: left;
    }
  }
}
</style>
