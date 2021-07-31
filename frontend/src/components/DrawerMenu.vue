<template>
  <div class="drawer-menu">
    <transition name="fade">
      <div class="bg-shade" v-show="mVisible" @click="mVisible=false"></div>
    </transition>
    <transition name="slide-fade">
      <div class="menu" :class="themeClass" v-show="mVisible">
        <div class="menu-title flex items-center justify-between">
          <span class="flex items-center">
            {{ $t('drawer.menu') }}
          </span>
          <button class="btn-no-style" @click="mVisible=false">
            <i class="material-icons">clear</i>
          </button>
        </div>

        <template
            v-for="(item, index) in menuList"
            :key="index"
        >
          <div v-if="item.subtitle" class="subtitle">{{ item.name }}</div>
          <button
              v-else
              v-show="!item.disabled"
              class="btn-no-style menu-item flex items-center"
              :class="{active: item.active}"
              @click="item.action && item.action()"
          >
            <span v-if="item.icon" class="material-icons">{{ item.icon }}</span> <span
              class="menu-item-title">{{ item.name }}</span>
          </button>
        </template>

        <button
            class="btn-no-style menu-item flex items-center"
            @click="toggleDarkTheme"
        >
          <span class="material-icons">brightness_4</span>
          <span class="menu-item-title">{{ $t('settings.dark-theme') }}
          <input type="checkbox"
                 :checked="isDarkTheme"
                 readonly>
          </span>
        </button>

        <button class="btn-no-style menu-item flex items-center cursor-default">
          <span class="material-icons">color_lens</span>
          <span class="menu-item-title">{{ $t('settings.theme-color') }}
            <input class="btn-no-style color-input" type="color" :value="themeColor" @change="handleThemeColorChange">
          </span>

        </button>

        <button class="btn-no-style menu-item flex items-center cursor-default">
          <span class="material-icons">translate</span>
          <span class="menu-item-title">{{ $t('settings.language') }}
            <select v-model="$i18n.locale" class="btn-styled" @change="saveLocateChange">
              <option
                  v-for="item in languages"
                  :key="item.locate"
                  :value="item.locate"
              >{{ item.name }}</option>
            </select>
          </span>
        </button>


      </div>
    </transition>

    <ModalDialog
        fixed
        v-model:visible="isShowLogin"
        :dark="isDarkTheme"
        is-show-close
    >
      <LoginPrompt
          @loginSuccess="handleLoginSuccess"
      />
    </ModalDialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, toRefs, computed, ref, watch} from 'vue';
import {useI18n} from "vue-i18n";
import {LS_KEY_LOCWEB_LOCATE} from "@/lang/i18n";
import useMVisible from "@/composables/useMVisible";
import router from '@/router'
import store from "@/store";
import ModalDialog from '@/components/ModalDialog.vue'
import LoginPrompt from '@/components/LoginPrompt.vue'
import {DrawerMenuTabItems} from "@/enum";
import {hexToRgb} from '@/utils/color'
import languages from "@/lang/languages"

export default defineComponent({
  name: 'DrawerMenu',
  components: {
    ModalDialog,
    LoginPrompt
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  setup(props, context) {
    const {t} = useI18n()
    const {visible} = toRefs(props)
    const {mVisible} = useMVisible(visible, context)
    const isShowLogin = ref(false)

    const token = computed(() => {
      return store.state.token
    })

    const navbarTab = computed({
      get() {
        return store.getters.navbarTab
      },
      set(val) {
        store.commit('setNavbarTab', val)
      }
    })

    const itemAbout = {
      name: t('page.about'), icon: 'info', action: () => {
        router.push({
          name: 'About'
        })
      }
    }
    const menuList = computed(() => {
      const itemLogin = !token.value ? {
        name: t('user.login'), icon: 'account_circle', action: () => {
          isShowLogin.value = true
        }
      } : {
        name: t('user.logout'), icon: 'logout', action: () => {
          const confirmed = confirm(t('msg.confirm-logout'))
          if (confirmed) {
            store.commit('setToken', null)
            window.$notify.success(t('msg.logout-completed'))
            mVisible.value = false
          }
        }
      }

      const tabItems = DrawerMenuTabItems.map(item => {
        return {
          ...item,
          active: navbarTab.value === item.value,
          action: () => {
            navbarTab.value = item.value
            mVisible.value = false
          }
        }
      })

      return [
        {name: t('drawer.music'), subtitle: true},
        ...tabItems,
        {name: t('drawer.system'), subtitle: true},
        {name: t('drawer.rescan-media'), icon: 'loop', disabled: true},
        itemLogin,
        itemAbout,
        {name: t('drawer.settings'), icon: 'settings', subtitle: true},
      ]
    })

    const isDarkTheme = computed(() => store.getters.isDarkTheme)

    const handleLoginSuccess = () => {
      window.$notify.success(t('msg.login-success'))
      isShowLogin.value = false
      mVisible.value = false
    }

    const themeColor = computed(() => store.getters.themeColor)

    const handleThemeColorChange = (event) => {
      const colorHex = event.target.value
      const {r, g, b} = hexToRgb(colorHex)
      console.log(colorHex)

      const root = document.documentElement;
      root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
      store.commit('updateSettings', {
        key: 'themeColor',
        value: colorHex
      })
    }

    const saveLocateChange = (event) => {
      localStorage.setItem('LS_KEY_LOCWEB_LOCATE', event.target.value)
    }

    return {
      languages,
      saveLocateChange,
      menuList,
      mVisible,
      token,
      isShowLogin,
      isDarkTheme,
      toggleDarkTheme() {
        store.commit('updateSettings', {
          key: 'isDarkTheme',
          value: !isDarkTheme.value
        })
      },
      themeClass: computed(() => store.getters.themeClass),
      handleLoginSuccess,
      themeColor,
      handleThemeColorChange
    }
  }
})
</script>

<style lang="scss" scoped>
.drawer-menu {
  position: relative;
  z-index: 1001;
  user-select: none;

  .bg-shade {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
  }

  .menu {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 240px;
    box-shadow: $shadow-5;
    overflow-x: hidden;

    &.bg-dark {
      .menu-title {
        background: rgba(0, 0, 0, 0.9);
      }

      .subtitle {
        background: rgba(0, 0, 0, 0.8);
        border-color: $grey-9;
      }

      .menu-item {
        & + .menu-item {
          border-color: $grey-9;
        }
      }
    }

    .menu-title {
      font-size: 18px;
      height: $navbarHeight;
      line-height: $navbarHeight;
      padding: 0 10px;
      font-weight: bold;
      background: $grey-3;
      position: sticky;
      top: 0;
      left: 0;

      .menu-icon {
        margin-right: 4px;
      }
    }

    .subtitle {
      padding: 0 10px;
      line-height: 2;
      border: 1px solid $border-color;
      border-left: 0;
      border-right: 0;
      font-size: 12px;
      font-weight: bold;
      background: $grey-3;
      position: sticky;
      top: 40px;
      left: 0;
    }

    .menu-item {
      & + .menu-item {
        border-top: 1px solid $border-color;
      }

      width: 100%;
      line-height: 40px;
      text-align: left;
      padding: 0 10px;

      &.active {
        background: $primary;
        color: white;

        .material-icons {
          color: white;
        }
      }

      .material-icons {
        color: $primary;
        margin-right: 10px;
        font-size: 20px;
      }

      .menu-item-title {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

    .color-input {
      width: 30px;
      height: 30px;
      padding: 0;
    }
  }
}

.slide-fade-enter-active {
  transition: all .2s ease-out;
}

.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
