<template>
  <div class="list-menu">
    <template v-for="(item, index) in list">
      <hr
        v-if="item.isSeparator"
        :key="index"
      />
      <TkButton
        v-else-if="!item.hidden"
        :key="index"
        size="no-style"
        class="menu-item"
        :class="item.customClass"
        :disabled="item.disabled"
        @click="item.action ? item.action() : () => {}"
        @contextmenu.prevent="item.action"
      >
        <i v-if="item.icon" class="material-icons text-primary">{{ item.icon }}</i>
        {{ item.label }}
      </TkButton>
    </template>

  </div>
</template>

<script >
export default {
  name: 'ListMenu',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.list-menu {
  button {
    min-width: 200px;
  }
}
</style>
