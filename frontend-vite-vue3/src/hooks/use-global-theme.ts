import {LdThemeType, useSettingsStore} from '@/store/settings'
import {useMainStore} from '@/store/main'

const getSystemIsDarkMode = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

export const useHandleThemeChange = () => {
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

  return {
    handleThemeChange,
  }
}

export const useGlobalTheme = () => {
  const mainStore = useMainStore()
  const {handleThemeChange} = useHandleThemeChange()
  const settingsStore = useSettingsStore()
  handleThemeChange(settingsStore.ldTheme)

  const handleSystemThemeChange = (event: any) => {
    if (settingsStore.ldTheme === LdThemeType.SYSTEM) {
      mainStore.isAppDarkMode = Boolean(event.matches)
    }
  }

  onMounted(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleSystemThemeChange)
  })

  onBeforeUnmount(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', handleSystemThemeChange)
  })

  const isAppDarkMode = computed(() => mainStore.isAppDarkMode)

  return {
    isAppDarkMode,
  }
}
