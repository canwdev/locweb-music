<template>
  <DrawerMenu
      v-model:visible="isShowMenu"
  />

  <div class="navbar flex">
    <button class="btn-no-style btn-menu" @click="isShowMenu = true"><i class="material-icons">menu</i></button>
    <button
        v-for="(item, index) in tabs"
        :key="item.value"
        @click="navbarIndex = index"
        :class="{active: index === navbarIndex}"
        class="btn-no-style btn-tab">
      <span v-if="item.icon" class="material-icons">{{ item.icon }}</span>
      {{ item.name }}
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, computed} from 'vue';
import store from '@/store'

import DrawerMenu from "@/components/DrawerMenu.vue";
import {
  NavbarTabsType,
  NavbarTabs
} from "@/enum";

export default defineComponent({
  name: 'NavBar',
  components: {
    DrawerMenu
  },
  setup() {
    const isShowMenu = ref(false)

    const navbarTab = computed({
      get() {
        return store.getters.navbarTab
      },
      set(val) {
        store.commit('setNavbarTab', val)
      }
    })

    const navbarIndex = computed({
      get() {
        return store.state.navbarIndex
      },
      set(val) {
        store.commit('setNavbarIndex', val)
      }
    })

    const tabs = computed(() => {
      return [
        // @ts-ignore
        NavbarTabs[navbarTab.value],
        NavbarTabs[NavbarTabsType.PLAYING],
      ]
    })

    return {
      isShowMenu,
      tabs,
      navbarTab,
      navbarIndex
    }
  }
});
</script>

<style lang="scss" scoped>
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: $navbarHeight;
  border-bottom: 1px solid $border-color;
  user-select: none;
  z-index: 2;

  .btn-menu {
    width: 44px;
    font-size: 22px;
  }

  .btn-tab {
    flex: 1;
    .material-icons {
      font-size: 16px;
      margin-right: 5px;
    }
  }

  & > button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    & + button {
      border-left: 1px solid $border-color;
    }

    &.btn-tab {
      font-size: 14px;

      &:after {
        position: absolute;
        left: 0;
        bottom: 0;
        content: " ";
        width: 100%;
        height: 6%;
        background: $primary;
        opacity: 0;
        transition: $generic-hover-transition;
      }

      &.active {
        color: $primary;
        font-weight: bold;

        &:after {
          opacity: 1;
        }
      }
    }


  }
}
</style>
