<template>
  <div class="navbar-component">
    <DrawerMenu
      :visible.sync="isShowMenu"
    />

    <div class="navbar flex">
      <TkButton size="no-style" class="btn-menu" @click="isShowMenu = true"><i class="material-icons">menu</i></TkButton>
      <TkButton
        v-for="(item) in tabs"
        :key="item.value"
        size="no-style"
        class="btn-tab active"
      >
        <span v-if="item.icon" class="material-icons">{{ item.icon }}</span>
        {{ item.label_i18n ? $t(item.label_i18n) : item.label }}
      </TkButton>
    </div>
  </div>
</template>

<script>
import DrawerMenu from '@/components/DrawerMenu.vue'
import {
  NavbarTabsType,
  NavbarTabs
} from '@/enum'

export default {
  name: 'Navbar',
  components: {
    DrawerMenu
  },
  data() {
    return {
      isShowMenu: false

    }
  },
  computed: {
    navbarTab: {
      get() {
        return this.$store.getters.navbarTab
      },
      set(val) {
        this.$store.commit('setNavbarTab', val)
      },
    },
    tabs() {
      return [
        NavbarTabs[this.navbarTab],
      ]
    }
  }
}
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
    border-radius: 0;
    border-right: 1px solid $border-color;
  }

  .btn-tab {
    flex: 1;
    cursor: default;
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
    border-radius: 0;

    &.btn-tab {
      font-size: 14px;

      &::after {
        position: absolute;
        left: 0;
        bottom: 0;
        content: " ";
        width: 100%;
        height: 6%;
        background: $primary;
        opacity: 0;
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

