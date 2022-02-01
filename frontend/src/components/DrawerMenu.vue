<template>
  <div class="drawer-component">
    <TkDrawer :title="$t('drawer.main-menu')" class="custom-drawer" :visible.sync="mVisible" :menu="menuList">

      <TkButton size="no-style" class="menu-item" @click="updateDarkTheme">
        <span class="material-icons">nights_stay</span>
        <span class="menu-item-title">
          {{ $t('settings.dark-theme') }}
          <TkSwitch :value="isDarkTheme"/>
        </span>
      </TkButton>

      <div style="height: 100px;"></div>

    </TkDrawer>
    <TkModalDialog
      v-model="isShowLogin"
      class="login-dialog"
      show-close
      fixed
    >
      <LoginPrompt
        @loginSuccess="handleLoginSuccess"
      />
    </TkModalDialog>
  </div>
</template>

<script >
import {mapGetters, mapState} from 'vuex'

import visibleMixin from '@/mixins/visible'
import LoginPrompt from '@/components/LoginPrompt.vue'
import {DrawerMenuTabItems} from '@/enum'
import languages from '@/lang/languages'
import {LS_KEY_LOCATE} from '@/lang/i18n'

const iconClass = 'material-icons'

export default {
  name: 'DrawerMenu',
  mixins: [visibleMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
  },
  components: {
    LoginPrompt
  },
  data() {
    return {
      languages: Object.freeze(languages),
      isShowLogin: false
    }
  },
  computed: {
    ...mapState([
      'token'
    ]),
    navbarTab: {
      get() {
        return this.$store.getters.navbarTab
      },
      set(val) {
        this.$store.commit('setNavbarTab', val)
      },
    },
    isDarkTheme: {
      get() {
        return this.$store.getters.isDarkTheme
      },
      set(val) {
        this.$store.commit('updateSettings', {
          key: 'isDarkTheme',
          value: val
        })
        this.$store.commit('updateSettings', {
          key: 'useSystemTheme',
          value: false
        })
      }
    },
    menuItemAbout() {
      return {
        iconClass,
        name: this.$t('page.about'), iconName: 'info', action: () => {
          this.$router.push({
            name: 'About'
          })
        }
      }
    },
    menuItemLogin() {
      return !this.token ? {
        iconClass,
        name: this.$t('user.login'), iconName: 'account_circle', action: () => {
          this.isShowLogin = true
        }
      } : {
        iconClass,
        name: this.$t('user.logout'), iconName: 'logout', action: () => {
          this.$prompt.create({
            propsData: {
              title: this.$t('msg.confirm-logout'),
            },
            parentEl: this.$el
          }).onConfirm(async () => {
            this.$store.commit('setToken', null)
            this.$toast.success(this.$t('msg.logout-completed'))
            this.mVisible = false
          })
        }
      }
    },
    menuTabItems() {
      return DrawerMenuTabItems.map(item => {
        return {
          ...item,
          name: item.label_i18n ? this.$t(item.label_i18n) : item.label,
          iconClass,
          active: this.navbarTab === item.value,
          action: () => {
            this.navbarTab = item.value
            this.mVisible = false
          }
        }
      })
    },
    menuList() {
      return [
        {name: this.$t('drawer.music'), subtitle: true},
        ...this.menuTabItems,
        {name: this.$t('drawer.system'), subtitle: true},
        // {name: this.$t('drawer.rescan-media'), iconName: 'loop', disabled: true},
        this.menuItemLogin,
        this.menuItemAbout,
        {name: this.$t('drawer.settings'), subtitle: true},
        {
          iconClass,
          name: this.$t('drawer.settings'), iconName: 'settings', action: () => {
            this.$router.push({
              name: 'Settings'
            })
          }
        }
      ]
    }
  },
  methods: {
    updateDarkTheme() {
      this.isDarkTheme = !this.isDarkTheme
    },
    handleLoginSuccess() {
      this.$toast.success(this.$t('msg.login-success'))
      this.isShowLogin = false
      this.mVisible = false
    }
  },
}
</script>

<style lang="scss" scoped>
.drawer-component {
  ::v-deep {
    .login-dialog {
      z-index: 1002;
    }
  }

  .tk-button {
    border-radius: 0;
  }

}
</style>
