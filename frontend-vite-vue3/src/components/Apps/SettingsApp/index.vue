<script lang="ts">
import {defineComponent} from 'vue'
import {
  customThemeOptions,
  ldThemeOptions,
  loopModeMap,
  StOptionItem,
  StOptionType,
} from '@/enum/settings'
import OptionUI from '@/components/Apps/SettingsApp/OptionUI/index.vue'
import {useSettingsStore} from '@/store/settings'
import {useI18n} from 'vue-i18n'

export default defineComponent({
  name: 'SettingsApp',
  components: {OptionUI},
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const settingsStore = useSettingsStore()

    const imageOptions = ref<StOptionItem[]>([
      {
        label: '个性化',
        key: 'personalization',
        children: [
          {
            label: '色彩模式',
            key: 'ldTheme',
            store: settingsStore,
            type: StOptionType.MULTIPLE_SWITCH,
            selectOptions: ldThemeOptions,
          },
          {
            label: '主题',
            key: 'customTheme',
            store: settingsStore,
            type: StOptionType.SELECT,
            selectOptions: customThemeOptions,
          },
          {
            label: 'enableRoundedTheme',
            key: 'enableRoundedTheme',
            store: settingsStore,
            type: StOptionType.SWITCH,
          },
          {
            label: 'enableAeroTheme',
            key: 'enableAeroTheme',
            store: settingsStore,
            type: StOptionType.SWITCH,
          },
        ],
      },
      {
        label: '系统设置',
        key: 'system',
        children: [
          {
            label: '音量',
            key: 'audioVolume',
            store: settingsStore,
            type: StOptionType.SLIDER,
            selectOptions: ldThemeOptions,
          },
          {
            label: '播放模式',
            key: 'loopMode',
            store: settingsStore,
            type: StOptionType.SELECT,
            selectOptions: Object.values(loopModeMap).map((i) => ({
              label: $t(i.i18nKey),
              value: i.value,
            })),
          },
        ],
      },
    ])

    return {
      imageOptions,
      settingsStore,
    }
  },
})
</script>

<template>
  <div class="settings-app">
    <OptionUI :option-list="imageOptions" />
  </div>
</template>

<style lang="scss" scoped>
.settings-app {
  height: 100%;
  overflow-y: auto;
}
</style>
