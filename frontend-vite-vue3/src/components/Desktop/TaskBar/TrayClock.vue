<script lang="ts">
import {defineComponent} from 'vue'
import moment from 'moment'

const timeFormat = 'HH:mm:ss YYYY/MM/DD ddd'

export default defineComponent({
  name: 'TrayClock',
  setup() {
    const time = ref('')
    const intervalRef = ref()

    onMounted(() => {
      intervalRef.value = setInterval(() => {
        time.value = moment().format(timeFormat)
      })
    })

    onBeforeUnmount(() => {
      clearInterval(intervalRef.value)
    })
    return {
      time,
    }
  },
})
</script>

<template>
  <div class="tray-datetime">{{ time }}</div>
</template>

<style lang="scss" scoped>
.tray-datetime {
  font-size: 12px;
  padding: 2px 5px;
}
</style>
