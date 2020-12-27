<template>
  <div class="drawer-menu">
    <transition name="fade">
      <div class="bg-shade" v-show="mVisible"  @click="mVisible=false"></div>
    </transition>
    <transition name="menuSlide">
      <div class="menu bg-glass-black" v-show="mVisible">
        <div class="menu-title flex items-center justify-between">
          <span><i class="iconfont icon-menu"></i> Menu</span>
          <button class="btn-no-style" @click="mVisible=false">
            <i class="iconfont icon-clear"></i>
          </button>
        </div>

        <template
            v-for="(item, index) in menuList"
            :key="index"
        >
          <div v-if="item.subtitle" class="subtitle">{{ item.name }}</div>
          <button
              v-else
              class="btn-no-style menu-item flex items-center">
            <i v-if="item.icon" class="iconfont" :class="item.icon"></i> {{ item.name }}
          </button>
        </template>

      </div>
    </transition>

  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'DrawerMenu',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      menuList: [
        {name: 'Music', subtitle: true},
        {name: 'File System', icon: 'icon-storage'},
        {name: 'Playlists', icon: 'icon-queue-muspx'},
        {name: 'Albums', icon: 'icon-album'},
        {name: 'Artists', icon: 'icon-mpx'},
        {name: 'Recent', icon: 'icon-history'},
        {name: 'Rated', icon: 'icon-stars'},
        {name: 'Search', icon: 'icon-search'},
        {name: 'System', subtitle: true},
        {name: 'Settings', icon: 'icon-settings'},
        {name: 'User Management', icon: 'icon-account-circle'},
        {name: 'Rescan Media', icon: 'icon-loop'},
      ]
    }
  },
  computed: {
    mVisible: {
      get(): boolean {
        return this.visible
      },
      set(nv: boolean) {
        return this.$emit('update:visible', nv)
      }
    },
  }
})
</script>

<style lang="scss" scoped>
.drawer-menu {
  position: relative;
  z-index: 99;
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
      line-height: 45px;
      padding: 0 10px;
      font-weight: bold;
      background: rgba(0, 0, 0, 0.9);

      .iconfont {
        margin-right: 2px;
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

      .iconfont {
        margin-right: 5px;
      }

      font-size: 16px;
      display: block;
      width: 100%;
      line-height: 40px;
      text-align: left;
      padding: 0 10px;
    }
  }
}

.menuSlide-enter-active {
  animation: menuSlide-in 0.3s;
}

.menuSlide-leave-active {
  animation: menuSlide-in 0.3s reverse;
}

@keyframes menuSlide-in {
  0% {
    opacity: 0;
    transform: translateX(-20%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
