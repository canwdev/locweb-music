<template>
  <div
    class="settings-item"
    :class="{
      'settings-item--disabled': item.disabled
    }"
  >
    <div class="settings-item__left">
      <div class="settings-item__icon">
        <span v-if="item.icon" class="material-icons">{{ item.icon }}</span>
      </div>
      <div class="settings-item__titles">
        <div class="settings-item__titles__title">{{ item.title || item.id }}</div>
        <div v-if="item.desc" class="settings-item__titles__subtitle">{{ item.desc }}</div>
      </div>
    </div>
    <div class="settings-item__right">
      <template v-if="SettingsType.SWITCH === item.type || SettingsType.CHECKBOX === item.type">
        <TkSwitch
          :checkbox="SettingsType.CHECKBOX === item.type"
          :value="currentValue"
          @click="handleSwitchClick"
        />
      </template>
      <template v-else-if="SettingsType.COLOR === item.type">
        <input
          class="tk-button-no-style color-input"
          type="color"
          :value="currentValue"
          @change="handleColorChange"
        >
      </template>
      <template v-else>
        <div class="current-value">{{ item.value || item.default }}</div>
      </template>

    </div>
  </div>
</template>

<script>
import {SettingsType} from '@/enum/settings'
import {mapState} from 'vuex'

export default {
  name: 'SettingsItem',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      SettingsType
    }
  },
  computed: {
    ...mapState([
      'settings'
    ]),
    currentValue() {
      return this.settings[this.item.id]
    }
  },
  methods: {
    updateSetting(value) {
      this.$store.commit('updateSettings', {
        key: this.item.id,
        value
      })
    },
    handleColorChange(event) {
      const colorHex = event.target.value

      this.updateSetting(colorHex)
    },
    handleSwitchClick() {
      this.updateSetting(!this.currentValue)
    }
  }
}
</script>

