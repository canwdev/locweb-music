<template>
  <div class="settings">
    <div
      v-for="(group, index) in settingsList"
      :key="index"
      class="settings__group"
    >
      <div class="settings__group__title">{{ group.title }}</div>
      <div class="settings__group__children">
        <SettingsItem
          v-for="(item) in group.children"
          :key="item.id"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SettingsItem from './SettingsItem'

export default {
  name: 'SettingsPage',
  components: {
    SettingsItem
  },
  props: {
    settingsList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
@import "settings";
</style>

