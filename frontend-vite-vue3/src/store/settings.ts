export enum LdThemeType {
  SYSTEM = 0,
  LIGHT = 1,
  DARK = 2,
}

export const ldThemeOptions = [
  {
    label: 'Follow System',
    value: LdThemeType.SYSTEM,
  },
  {
    label: 'Light Theme',
    value: LdThemeType.LIGHT,
  },
  {
    label: 'Dark Theme',
    value: LdThemeType.DARK,
  },
]

interface IPageCraftSettings {
  ldTheme: LdThemeType
}

export const useSettingsStore = defineStore('settingsStore', {
  state: (): IPageCraftSettings => {
    return {
      ldTheme: LdThemeType.SYSTEM,
    }
  },
  persist: {
    key: 'ls_key_localweb_settings',
  },
})
