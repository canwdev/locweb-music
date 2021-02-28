import {computed} from 'vue'

export default function (visible, context) {
  const mVisible = computed({
    get(): boolean {
      return visible.value
    },
    set(nv: boolean) {
      return context.emit('update:visible', nv)
    }
  })

  return {
    mVisible
  }
}
