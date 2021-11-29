<template>
  <div class="navbar-component">
    <DrawerMenu
      :visible.sync="isShowMenu"
    />

    <div class="navbar flex">
      <TkButton size="no-style" class="btn-menu" @click="isShowMenu = true"><i class="material-icons">menu</i></TkButton>
      <TkButton
        v-for="(item, index) in tabs"
        :key="item.value"
        size="no-style"
        :class="{active: index === navbarIndex}"
        class="btn-tab"
        @click="navbarIndex = index"
      >
        <span v-if="item.icon" class="material-icons">{{ item.icon }}</span>
        {{ item.name }}
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
    navbarIndex: {
      get() {
        return this.$store.state.navbarIndex
      },
      set(val) {
        this.$store.commit('setNavbarIndex', val)
      },
    },
    tabs() {
      return [
        NavbarTabs[this.navbarTab],
        NavbarTabs[NavbarTabsType.PLAYING],
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
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    border-right: 1px solid $border-color;
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
    border-radius: 0;

    &.btn-tab {
      font-size: 14px;

      &::before {
        position: absolute;
        left: -1px;
        top: 0;
        bottom: 0;
        content: " ";
        background: $border-color;
        width: 1px;
      }

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

