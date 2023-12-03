type CraftStore = {
  isAppDarkMode: boolean
}

export const useMainStore = defineStore('main', {
  state: (): CraftStore => {
    return {
      isAppDarkMode: true,
    }
  },
  actions: {},
})
