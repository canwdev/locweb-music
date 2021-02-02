import { ref, onMounted, watch } from 'vue'

export default function useCoverImage(musicItem) {
  const coverImage = ref<null|string>(null)

  watch(musicItem, async (val) => {
    coverImage.value = await val.getCover()
  }, {deep: true})

  return {
    coverImage
  }
}
