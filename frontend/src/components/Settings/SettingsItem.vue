<template>
  <div
    class="settings-item"
    :class="[{
      'settings-item--disabled': isDisabled,
      'settings-item--acc': allowCommonClick,
    }, item.className]"
    @click="handleCommonClick"
  >
    <div class="settings-item__left">
      <div class="settings-item__icon">
        <span v-if="icon" class="material-icons">{{ icon }}</span>
      </div>
      <div class="settings-item__titles">
        <div class="settings-item__titles__title">{{ title || item.id }}</div>
        <div v-if="item.desc" class="settings-item__titles__subtitle">{{ item.desc }}</div>
      </div>
    </div>
    <div class="settings-item__right">
      <template v-if="SettingsType.SWITCH === item.type || SettingsType.CHECKBOX === item.type">
        <TkSwitch
          ref="clickableRef"
          :checkbox="SettingsType.CHECKBOX === item.type"
          :value="currentValue"
          :disabled="isDisabled"
          @click.stop="handleSwitchClick"
        />
      </template>
      <template v-else-if="SettingsType.COLOR === item.type">
        <input
          ref="clickableRef"
          class="tk-button-no-style color-input"
          type="color"
          :disabled="isDisabled"
          :value="currentValue"
          @click.stop
          @change="handleColorChange"
        >
      </template>
      <template v-else-if="SettingsType.SELECT === item.type">
        <TkDropdown
          ref="clickableRef"
          :disabled="isDisabled"
          :value="currentValue"
          :customized="typeof item.options === 'function'"
          :options="dropdownOptions"
          @click.stop
          @change="handleSelectChange"
        />
      </template>
      <template v-else>
        <div class="current-value" @click.stop>{{ currentValue }}</div>
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
    icon() {
      const {icon} = this.item
      if (typeof icon === 'function') {
        return icon.call(this, this.settings)
      }
      return icon
    },
    currentValue() {
      const value = this.settings[this.item.id]
      if (value === undefined || value === null) {
        return this.item.default
      }
      return value
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
    },
    allowCommonClick() {
      return !this.isDisabled && this.item.type && SettingsType.SELECT !== this.item.type
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
    },
    handleCommonClick() {
      if (!this.allowCommonClick) {
        return
      }
      let el = this.$refs.clickableRef
      if (el._isVue) {
        el = el.$el
      }
      el.click()
    }
  }
}
</script>

