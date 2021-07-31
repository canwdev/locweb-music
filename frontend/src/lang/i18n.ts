import { createI18n } from 'vue-i18n'

import languages from "./languages"
import en from './messages/en.json'
import zhCN from './messages/zh-CN.json'
import zhTW from './messages/zh-TW.json'
import ja from './messages/ja.json'

export const LS_KEY_LOCWEB_LOCATE = 'LS_KEY_LOCWEB_LOCATE'

const defaultLocale = localStorage.getItem(LS_KEY_LOCWEB_LOCATE) || languages[0].locate

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'en', //defaultLocale,
  messages: {
    'en': en,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'ja': ja,
  }
})

export default i18n
