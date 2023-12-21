<script lang="ts">
import {defineComponent} from 'vue'
import {useI18n} from 'vue-i18n'
import {useSettingsStore} from '@/store/settings'
import OptionUI from '@/components/CommonUI/OptionUI/index.vue'
import {
  customThemeOptions,
  CustomThemeType,
  ldThemeOptions,
  loopModeMap,
  SettingsTabType,
} from '@/enum/settings'
import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'

export default defineComponent({
  name: 'SettingsSystem',
  components: {OptionUI},
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const settingsStore = useSettingsStore()

    const optionList = computed((): StOptionItem[] => {
      return [
        {
          label: '媒体设置',
          key: 'media_settings',
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
      ]
    })

    return {
      optionList,
    }
  },
})
</script>

<template>
  <OptionUI :option-list="optionList" />
</template>
