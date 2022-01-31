<template>
  <div
    class="settings-item"
    :class="{
      'settings-item--disabled': isDisabled
    }"
  >
    <div class="settings-item__left">
      <div class="settings-item__icon">
        <span v-if="item.icon" class="material-icons">{{ item.icon }}</span>
      </div>
      <div class="settings-item__titles">
        <div class="settings-item__titles__title">{{ title || item.id }}</div>
        <div v-if="item.desc" class="settings-item__titles__subtitle">{{ item.desc }}</div>
      </div>
    </div>
    <div class="settings-item__right">
      <template v-if="SettingsType.SWITCH === item.type || SettingsType.CHECKBOX === item.type">
        <TkSwitch
          :checkbox="SettingsType.CHECKBOX === item.type"
          :value="currentValue"
          :disabled="isDisabled"
          @click="handleSwitchClick"
        />
      </template>
      <template v-else-if="SettingsType.COLOR === item.type">
        <input
          class="tk-button-no-style color-input"
          type="color"
          :disabled="isDisabled"
          :value="currentValue"
          @change="handleColorChange"
        >
      </template>
      <template v-else-if="SettingsType.SELECT === item.type">
        <TkDropdown
          :disabled="isDisabled"
          :value="currentValue"
          :customized="typeof item.options === 'function'"
          :options="dropdownOptions"
          @change="handleSelectChange"
        />
      </template>
      <template v-else>
        <div class="current-value">{{ currentValue }}</div>
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
    title() {
      return this.getI18nValue('title')
    },
    desc() {
      return this.getI18nValue('desc')
    },
    currentValue() {
      return this.settings[this.item.id]
    },
    isDisabled() {
      const {disabled} = this.item
      if (typeof disabled === 'function') {
        return disabled(this.settings)
      }
      return disabled
    },
    dropdownOptions() {
      if (SettingsType.SELECT !== this.item.type) {
        return
      }
      const {options} = this.item
      if (typeof options === 'function') {
        return options.call(this)
      }
      return options
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
    },
    getI18nValue(key) {
      if (!key) {
        return
      }
      const {item} = this
      if (item.i18n) {
        return this.$t(item[key])
      }
      return item[key]
    },
    handleSelectChange(value) {
      // console.log(value)
      this.updateSetting(value)
    }
  }
}
</script>

