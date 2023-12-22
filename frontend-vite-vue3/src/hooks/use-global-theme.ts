import {useSettingsStore} from '@/store/settings'
import {CustomThemeType, LdThemeType} from '@/enum/settings'

import {useMainStore} from '@/store/main'
import {hexToRgb} from '@/utils/color'

const getSystemIsDarkMode = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

export const useGlobalTheme = () => {
  const mainStore = useMainStore()
  const settingsStore = useSettingsStore()

  const handleThemeChange = (val: LdThemeType) => {
    if (val === LdThemeType.SYSTEM) {
      mainStore.isAppDarkMode = getSystemIsDarkMode()
    } else if (val === LdThemeType.LIGHT) {
      mainStore.isAppDarkMode = false
    } else if (val === LdThemeType.DARK) {
      mainStore.isAppDarkMode = true
    }
    settingsStore.ldTheme = val
  }

  handleThemeChange(settingsStore.ldTheme)

  const handleSystemThemeChange = (event: any) => {
    if (settingsStore.ldTheme === LdThemeType.SYSTEM) {
      mainStore.isAppDarkMode = Boolean(event.matches)
    }
  }

  watch(() => settingsStore.ldTheme, handleThemeChange)

  const isAppDarkMode = computed(() => mainStore.isAppDarkMode)

  const isRect = computed(() => {
    return (
      !settingsStore.enableRoundedTheme ||
      settingsStore.customTheme === CustomThemeType.MINIMALISM ||
      settingsStore.customTheme === CustomThemeType.WIN8 ||
      settingsStore.customTheme === CustomThemeType.CLASSIC
    )
  })
  const isAero = computed(() => {
    return settingsStore.enableAeroTheme && settingsStore.customTheme === CustomThemeType.DEFAULT
  })

  const updateThemeColor = () => {
    const themeColor = settingsStore.themeColor
    // console.log({themeColor})
    if (themeColor) {
      const res = hexToRgb(themeColor)
      if (!res) {
        return
      }
      const {r, g, b} = res
      const root = document.documentElement
      root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`)
    }
  }

  watch(
    () => settingsStore.themeColor,
    () => {
      updateThemeColor()
    }
  )

  onBeforeUnmount(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', handleSystemThemeChange)
  })
  onMounted(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleSystemThemeChange)
    updateThemeColor()
  })

  return {
    isRect,
    isAero,
    isAppDarkMode,
  }
}
