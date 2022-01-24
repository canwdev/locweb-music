<template>
  <PageLayout
    :title="$t('drawer.settings')"
    :back-text="$t('back')"
    class="settings-page"
    @back="$router.back()"
  >
    <Settings :settings-list="settingsList"/>
  </PageLayout>
</template>

<script>
import Settings from '@/components/Settings'
import PageLayout from '@/components/PageLayout'
import {settingsList} from '@/enum/settings'

export default {
  name: 'SettingsPage',
  components: {
    Settings,
    PageLayout,
  },
  data() {
    return {
      settingsList
    }
  }
}
</script>

<style lang="scss" scoped>
.settings-page {}
</style>

