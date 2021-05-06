<template>
  <div class="drawer-menu">
    <transition name="fade">
      <div class="bg-shade" v-show="mVisible" @click="mVisible=false"></div>
    </transition>
    <transition name="slide-fade">
      <div class="menu bg-dark" v-show="mVisible">
        <div class="menu-title flex items-center justify-between">
          <span class="flex items-center">
            Menu
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
              :disabled="item.disabled"
              class="btn-no-style menu-item flex items-center"
              @click="item.action && item.action()"
          >
            <span v-if="item.icon" class="material-icons">{{ item.icon }}</span> <span>{{ item.name }}</span>
          </button>
        </template>

      </div>
    </transition>

    <ModalDialog
        v-model:visible="isShowLogin"
        is-show-close
    >
      <LoginPrompt
        @submitted="isShowLogin = false"
      />
    </ModalDialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, toRefs, computed, ref} from 'vue';
import useMVisible from "@/composables/useMVisible";
import router from '@/router'
import store from "@/store";
import ModalDialog from '@/components/ModalDialog.vue'
import LoginPrompt from '@/components/LoginPrompt.vue'

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
    const {visible} = toRefs(props)
    const {mVisible} = useMVisible(visible, context)
    const isShowLogin = ref(false)

    const token = computed(() => {
      return store.state.token
    })

    const menuList = computed(() => {
      return [
        {name: 'Music', subtitle: true},
        {name: 'File System', icon: 'storage'},
        {name: 'Playlists', icon: 'queue_music', disabled: true},
        // {name: 'Albums', icon: 'album'},
        // {name: 'Artists', icon: 'mic'},
        // {name: 'Recent', icon: 'history'},
        // {name: 'Rated', icon: 'stars'},
        // {name: 'Search', icon: 'search'},
        {name: 'System', subtitle: true},
        // {name: 'Settings', icon: 'settings'},
        !token.value ? {
          name: 'Login', icon: 'account_circle', action: () => {
            isShowLogin.value = true
          }
        } : {
          name: 'Logout', icon: 'account_circle', action: () => {
            store.commit('setToken', null)
          }
        },
        // {name: 'Rescan Media', icon: 'loop'},
        {
          name: 'About', icon: 'info', action: () => {
            router.push({
              name: 'About'
            })
          }
        },
      ]
    })

    return {
      menuList,
      mVisible,
      token,
      isShowLogin
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

    .menu-title {
      font-size: 18px;
      height: $navbarHeight;
      line-height: $navbarHeight;
      padding: 0 10px;
      font-weight: bold;
      background: rgba(0, 0, 0, 0.9);

      .menu-icon {
        margin-right: 4px;
      }
    }

    .subtitle {
      padding: 0 10px;
      line-height: 2;
      border: 1px solid $grey-9;
      border-left: 0;
      border-right: 0;
      font-size: 12px;
      font-weight: bold;
      background: rgba(0, 0, 0, 0.8);
    }

    .menu-item {
      & + .menu-item {
        border-top: 1px solid $grey-9;
      }

      display: block;
      width: 100%;
      line-height: 40px;
      text-align: left;
      padding: 0 10px;

      .material-icons {
        color: $primary;
        margin-right: 5px;
        font-size: 20px;
        transform: translateY(4px);
      }
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
