<template>
  <div class="settings">
    <div
      v-for="(group, index) in settingsList"
      :key="index"
      class="settings__group"
    >
      <div class="settings__group__title">{{ group.title }}</div>
      <div class="settings__group__children">
        <div
          v-for="(item) in group.children"
          :key="item.id"
          class="settings-item"
        >
          <div class="settings-item__left">
            <div class="settings-item__icon">
              <span v-if="item.icon" class="material-icons">{{ item.icon }}</span>
            </div>
            <div class="settings-item__titles">
              <div class="settings-item__titles__title">{{ item.title || item.id }}</div>
              <div v-if="item.desc" class="settings-item__titles__subtitle">{{ item.desc }}</div>
            </div>
          </div>
          <div class="settings-item__right"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SettingsPage',
  props: {
    settingsList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.settings {
  padding: 10px 0;

  * {
    box-sizing: border-box;
  }

  $icon-size: 40px;

  &__group {
    padding: 10px 10px;

    @media screen and (max-width: $mq_mobile_width) {
      padding: 10px
    }

    &+ .settings__group{
      border-top: $layout-border;
    }

    &__title {
      color: $primary;
      font-weight: 500;
      padding-bottom: 10px;
      padding-left: $icon-size + 10px;
      padding-right: 10px;
    }

    &__children {}
  }

  .settings-item {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    transition: all .3s;
    border-radius: $border-radius;
    padding: 0 5px;

    &:hover {
      background-color: $separator-color;
    }

    &__left {
      box-sizing: border-box;
      display: flex;
      height: 55px;
      padding: 10px 0;
      flex: 1;
    }

    &__titles {
      padding-left: 5px;
      height: 100%;
      flex: 1;
      display: flex;
      justify-content: center;
      flex-direction: column;

      &__title {
        font-weight: 500;
      }

      &__subtitle {
        margin-top: 2px;
        font-size: 14px;
        opacity: .6 ;
      }
    }

    &__icon {
      width: $icon-size;
      display: flex;
      align-items: center;
      justify-content: center;
      .material-icons {
        opacity: .8;
      }
    }
  }
}
</style>

