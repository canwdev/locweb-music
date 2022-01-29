<template>
  <div class="page-layout">
    <div class="page-layout__header">
      <TkButton
        class="page-layout__header__back"
        @click="$emit('back')">{{ backText }}</TkButton>
      <div class="page-layout__header__title">{{ title }}</div>
    </div>
    <div class="page-layout__main">
      <div class="page-layout__container">
        <slot></slot>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'PageLayout',
  props: {
    title: {
      type: String
    },
    backText: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.page-layout {
  display: flex;
  flex-direction: column;
  height: 100%;

  $header-height: 50px;
  $container-width: 800px;

  &__header {
    height: $header-height;
    border-bottom: $layout-border;
    display: flex;
    align-items: center;
    padding: 0 10px;
    box-shadow: 0 0 10px $border-color;

    &__title {
      font-weight: 600;
      padding: 0 10px;
    }
  }

  &__main {
    flex: 1;
    overflow: auto;
    padding: 20px 0;

    @media screen and (max-width: $container-width) {
      padding: 0;
    }
  }

  &__container {
    max-width: $container-width;
    box-shadow: 0 0 10px $border-color;
    border: $layout-border;
    border-radius: $border-radius;
    margin: 0 auto;

    @media screen and (max-width: $container-width) {
      border: none;
      box-shadow: none;
    }
  }
}
</style>

