<template>
  <div class="login-wrap">
    <form ref="form" @submit.stop.prevent="submitLogin">
      <div class="form-title">{{ $t('user.login') }}</div>
      <div class="form-row">
        <div class="form-row-title">{{ $t('user.username') }}</div>
        <input
            id="name-input"
            v-model="form.username"
            required
            class="input-styled"
        >
      </div>

      <div class="form-row">
        <div class="form-row-title">{{ $t('user.password') }}</div>
        <input
            id="password-input"
            type="password"
            v-model="form.password"
            required
            class="input-styled"
        >
      </div>
      <div class="form-row text-center">
        <button type="submit" class="btn-styled">{{ $t('submit') }}</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import store from "@/store";
import {getAuth} from "@/api/service";

export default defineComponent({
  name: "LoginPrompt",
  setup(props, context) {
    const form = ref({
      username: '',
      password: ''
    })

    const submitLogin = async () => {
      const {
        token
      } = await getAuth({
        username: form.value.username,
        password: form.value.password
      })
      store.commit('setToken', token)
      context.emit('loginSuccess')
    }

    return {
      form,
      submitLogin
    }
  }
})
</script>

<style lang="scss" scoped>
.login-wrap {
  padding: 10px;

  .form-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }

  .form-row {
    margin-top: 10px;

    .form-row-title {
      font-size: 12px;
      color: $grey;
    }
  }
}
</style>
