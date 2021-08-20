import Component from './src/toast.ts'

export default {
  install(app) {
    app.config.globalProperties.$toast = Component
  }
}
