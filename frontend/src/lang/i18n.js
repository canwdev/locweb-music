import en from './messages/en.json'
import zhCN from './messages/zh-CN.json'
import zhTW from './messages/zh-TW.json'
import ja from './messages/ja.json'
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export const LS_KEY_LOCATE = 'LS_KEY_LOCWEB_LOCATE'
let defaultLocale = localStorage.getItem(LS_KEY_LOCATE)

if (!defaultLocale) {
  const locale = navigator.language

  if (/^zh-TW/i.test(locale)) {
    defaultLocale = 'zh-TW'
  } else if (/^zh/i.test(locale)) {
    defaultLocale = 'zh-CN'
  } else if (/^ja/i.test(locale)) {
    defaultLocale = 'ja'
  } else {
    defaultLocale = 'en'
  }
}


const i18n = new VueI18n({
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
