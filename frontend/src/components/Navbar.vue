<template>
  <DrawerMenu
    v-model:visible="isShowMenu"
  />

  <div class="navbar bg-glass-black flex">
    <button class="btn-no-style btn-menu" @click="isShowMenu = true"><i class="iconfont icon-menu"></i></button>
    <button
        v-for="item in tabs"
        :key="item.value"
        @click="tab = item.value"
        :class="{active: item.value === tab}"
        class="btn-no-style btn-tab">{{ item.name }}</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import DrawerMenu from "@/components/DrawerMenu.vue";

export default defineComponent({
  name: 'NavBar',
  components: {
    DrawerMenu
  },
  data() {
    return {
      isShowMenu: false,
      tabs: [
        {name: 'Files', value: 0},
        {name: 'Playing', value: 1},
      ]
    }
  },
  computed: {
    tab: {
      get() {
        return Number(this.$route.query.tab) || 0
      },
      set(nv) {
        this.$router.replace({
          path: this.$route.path, query: {
            ...this.$route.query,
            tab: nv
          }
        })
      }
    }
  },
  watch: {
    tab: {
      handler(val) {
        this.$store.commit('setIsPlaylistTab', val === 1)
      },
      immediate: true
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
      border-left: 1px solid $grey-8;
    }

    &:after {
      position: absolute;
      left: 0;
      bottom: 0;
      content: " ";
      width: 100%;
      height: 10%;
      background: $pink;
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
