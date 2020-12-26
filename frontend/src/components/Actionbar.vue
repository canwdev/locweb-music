<template>
  <div class="actionbar bg-glass-black flex items-center">
    <button class="btn-no-style btn-cover">Cover</button>
    <button class="btn-no-style btn-song">
      <span class="title text-overflow">皇悠麗洞 ～Repeat of the World～</span>
      <span class="artist text-overflow">茶太</span>
    </button>
    <div class="buttons-scroll flex items-center ">
      <button class="btn-no-style btn-action">Prev.</button>
      <button class="btn-no-style btn-action">Play</button>
      <button class="btn-no-style btn-action">Next.</button>
      <button class="btn-no-style btn-action">Vol.</button>
      <button class="btn-no-style btn-action">Shuffle</button>
      <button class="btn-no-style btn-action">Loop</button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'Actionbar'
});
</script>

<style lang="scss" scoped>
.actionbar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 55px;
  box-shadow: $shadow-1;
  user-select: none;

  .btn-cover {
    margin-left: 2px;
    width: 50px;
    height: 50px;
    background: $pink;
    font-size: 12px;
    border-radius: 2px;
  }

  .btn-song {
    width: 50%;
    height: 100%;
    border-right: 1px solid $grey-8;
    text-align: left;
    font-size: 12px;
    padding-left: 5px;

    .title {
      font-size: 14px;
      margin-bottom: 5px;
    }

    &>span {
      display: block;
      width: 100%;
    }
  }

  .buttons-scroll {
    overflow: auto;
    height: 100%;
    flex: 1;
    flex-wrap: nowrap;
    &>button {
      height: 100%;
      width: 55px;
      font-size: 12px;
      flex-shrink: 0;
      &+button {
        border-left: 1px solid $grey-8;
      }
    }
  }
}
</style>
