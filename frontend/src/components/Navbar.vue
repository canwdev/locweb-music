<template>
  <DrawerMenu
    v-model:visible="isShowMenu"
  />

  <div class="navbar bg-glass-white flex">
    <button class="btn-no-style btn-menu" @click="isShowMenu = true"><i class="material-icons">menu</i></button>
    <button
        v-for="item in tabs"
        :key="item.value"
        @click="navbarTab = item.value"
        :class="{active: item.value === navbarTab}"
        class="btn-no-style btn-tab">{{ item.name }}</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, computed} from 'vue';
import store from '@/store'

import DrawerMenu from "@/components/DrawerMenu.vue";
import {NavbarTabsEnum} from "@/enum";

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

    return {
      isShowMenu,
      tabs: [
        {name: 'Files', value: NavbarTabsEnum.MAIN},
        {name: 'Playing', value: NavbarTabsEnum.PLAYING},
      ],
      navbarTab
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
  height: 45px;
  box-shadow: $shadow-1;
  user-select: none;
  z-index: 2;

  .btn-menu {
    width: 44px;
    font-size: 22px;
  }

  .btn-tab {
    flex: 1;
  }

  & > button {
    position: relative;

    & + button {
      border-left: 1px solid $border-color;
    }

    &:after {
      position: absolute;
      left: 0;
      bottom: 0;
      content: " ";
      width: 100%;
      height: 10%;
      background: $primary;
      opacity: 0;
      transition: $generic-hover-transition;
    }

    &.active {
      &:after {
        opacity: 1;
      }
    }
  }
}
</style>
