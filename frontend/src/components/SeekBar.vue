<template>
  <div class="seekbar-wrap" :class="{vertical}">
    <div
        v-if="!vertical"
        class="seekbar-fill"
        :style="'width:'+progress+'%'"></div>
    <input
        ref="seekBar"
        type="range"
        :min="min"
        :max="max"
        :value="value"
        @input="e => $emit('input', e)"
        @change="e => $emit('change', e)"
        class="common-seekbar seekbar-input"
    >
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, toRefs} from 'vue';

export default defineComponent({
  name: "SeekBar",
  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    value: {
      type: Number,
      default: 100
    },
    vertical: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const {max, value} = toRefs(props)
    const progress = computed(() => {
      return (value.value / max.value * 100).toFixed(1)
    })

    return {
      progress
    }
  }
})
</script>

<style lang="scss" scoped>
.seekbar-wrap {
  height: 100%;
  flex: 1;
  position: relative;
  overflow: hidden;

  &.vertical {
    input {
      writing-mode: bt-lr; /* IE */
      -webkit-appearance: slider-vertical; /* WebKit */
      height: 100%;
      outline: none;
    }

  }

  .seekbar-fill {
    position: absolute;
    top: 49%;
    transform: translateY(-50%);
    height: 5px;
    width: 0;
    background: $primary;
    user-select: none;
    pointer-events: none;
    z-index: 0;
    border-radius: 2px;
  }

  input {
    width: 100%;
    appearance: none;
    height: 5px;
    background: $border-color;
    outline: none;
    border-radius: 2px;
    box-shadow: none;

    @mixin mixin-thumb {
      position: relative;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: $primary;
      z-index: 10;
      border: none;
      box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.2);
      cursor: grab;
      &:active {
        cursor: grabbing;
      }
    }

    &::-webkit-slider-thumb {
      @include mixin-thumb;
    }
    &::-moz-range-thumb {
      @include mixin-thumb;
    }
  }
}
</style>
