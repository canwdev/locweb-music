<template>
  <transition
      name="fade"
      @before-leave="onClose"
      @after-leave="$emit('destroy')"
  >
    <div
      v-show="visible"
      :id="id"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      Toast!!
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType, onMounted, onBeforeUnmount } from 'vue'
export default defineComponent({
  name: 'TkToast',
  props: {
    message: {
      type: [String, Object],
      default: '',
    },
    duration: { type: Number, default: 3000 },
    type: { type: String, default: 'info' },
    offset: { type: Number, default: 20 },
    zIndex: { type: Number, default: 0 },
  },
  emits: ['destroy'],
  setup(props) {
    const customStyle = computed(() => {
      return {
        top: `${props.offset}px`,
        zIndex: props.zIndex
      }
    })

    const visible = ref(false)
    let timer = null

    function close() {
      visible.value = false
    }

    function startTimer() {
      if (props.duration > 0) {
        timer = setTimeout(() => {
          if (visible.value) {
            close()
          }
        }, props.duration)
      }
    }

    function clearTimer() {
      clearTimeout(timer)
      timer = null
    }

    onMounted(() => {
      startTimer()
      visible.value = true
    })

    return {
      customStyle,
      visible,
      close,
      startTimer,
      clearTimer
    }

  }
})
</script>
