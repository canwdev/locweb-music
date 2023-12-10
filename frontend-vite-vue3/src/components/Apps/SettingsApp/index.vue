<script lang="ts">
import {defineComponent} from 'vue'
import {customThemeOptions, CustomThemeType, ldThemeOptions, loopModeMap} from '@/enum/settings'
import OptionUI from '@/components/CommonUI/OptionUI/index.vue'
import {useSettingsStore} from '@/store/settings'
import {useI18n} from 'vue-i18n'
import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'

const getWallpaperText = () => {
  const list = [
    {label: '必应壁纸', url: 'https://api.dujin.org/bing/1920.php'},
    {label: '二次元', url: 'https://api.dujin.org/pic/'},
    {label: '吉卜力', url: 'https://api.dujin.org/pic/ghibli'},
    {label: '风景', url: 'https://api.dujin.org/pic/fengjing'},
  ]
  let tpl = `<b><a href="https://www.dujin.org/12142.html" target="_blank">随机壁纸API</a></b>`

  list.forEach((item) => {
    tpl += `<br>${item.label}: <a href="${item.url}" target="_blank">${item.url}</a>`
  })

  return tpl
}

export default defineComponent({
  name: 'SettingsApp',
  components: {OptionUI},
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const settingsStore = useSettingsStore()

    const optionList = computed((): StOptionItem[] => {
      return [
        {
          label: '个性化',
          key: 'personalization',
          children: [
            {
              label: '桌面壁纸',
              key: 'desktopWallpaper',
              store: settingsStore,
              type: StOptionType.INPUT,
              tips: getWallpaperText(),
            },
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
            settingsStore.customTheme === CustomThemeType.DEFAULT && {
              label: 'enableRoundedTheme',
              key: 'enableRoundedTheme',
              store: settingsStore,
              type: StOptionType.SWITCH,
            },
            settingsStore.customTheme === CustomThemeType.DEFAULT && {
              label: 'Aero 效果',
              key: 'enableAeroTheme',
              store: settingsStore,
              type: StOptionType.SWITCH,
            },
          ].filter(Boolean),
        },
        {
          label: '系统设置',
          key: 'system',
          children: [
            {
              label: '多窗口模式',
              key: 'isWindowed',
              store: settingsStore,
              type: StOptionType.SWITCH,
            },
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
            {
              label: '显示任务栏时钟',
              key: 'isShowClock',
              store: settingsStore,
              type: StOptionType.SWITCH,
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
  <div class="settings-app">
    <OptionUI :option-list="optionList" />
  </div>
</template>

<style lang="scss" scoped>
.settings-app {
  height: 100%;
  overflow-y: auto;
}
</style>
