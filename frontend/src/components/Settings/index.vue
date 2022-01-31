<template>
  <div class="settings">
    <template v-for="(group, index) in settingsList">
      <div
        v-if="!group.hidden"
        :key="index"
        class="settings__group"
      >
        <div class="settings__group__title">{{ group.title }}</div>
        <div class="settings__group__children">
          <template v-for="(item) in group.children">
            <SettingsItem
              v-if="!item.hidden"
              :key="item.id"
              :item="item"
            />
          </template>
        </div>
      </div>
    </template>

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

