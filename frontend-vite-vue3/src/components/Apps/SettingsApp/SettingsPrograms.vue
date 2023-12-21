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
import {AllAppList} from '@/enum/app'

export default defineComponent({
  name: 'SettingsPrograms',
  components: {OptionUI},
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const settingsStore = useSettingsStore()

    const optionList = computed((): StOptionItem[] => {
      return [
        {
          label: '应用管理',
          key: 'app_management',
          children: AllAppList.map((item) => {
            return {
              icon: item.icon,
              label: item.title,
              key: item.appid,
            }
          }),
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
