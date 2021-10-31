<template>
  <div class="list-menu">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="list-item"
    >
      <TkButton
        size="no-style"
        :disabled="item.disabled"
        @click="item.action ? item.action() : () => {}"
      >{{ item.label }}
      </TkButton>
    </div>

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
  width: 200px;

  &.bg-light {
    border-radius: $border-radius;
  }

  & > .list-item {
    display: block;

    button {
      width: 100%;
      height: 40px;
    }

    & + .list-item {
      border-top: 1px solid $border-color;
    }
  }
}
</style>
