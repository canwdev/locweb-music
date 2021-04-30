<template>
  <div class="auto-ratio-box">
    <div
      class="height-box"
      :style="{paddingBottom: `${(mRatio*100).toFixed(2)}%`}"
    ></div>

    <div class="box-content">
      <slot>
      </slot>
    </div>

  </div>
</template>

<script>
/*自动计算长宽比的盒子*/
export default {
  name: 'AutoRatioBox',
  props: {
    width: {
      type: Number,
      default: 1
    },
    height: {
      type: Number,
      default: 1
    },
    ratio: {
      type: Number,
      default: null
    }
  },
  computed: {
    mRatio() {
      if (this.ratio) {
        return Number(this.ratio)
      }
      return (Number(this.height) / Number(this.width))
    }
  }
}
</script>

<style lang="scss" scoped>
.auto-ratio-box {
  position: relative;
  width: 100%;

  .box-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
