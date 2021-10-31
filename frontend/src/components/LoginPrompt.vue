<template>
  <div class="login-wrap">
    <form ref="form" @submit.stop.prevent="submitLogin">
      <div class="form-title">{{ $t('user.login') }}</div>
      <div class="form-row">
        <div class="form-row-title">{{ $t('user.username') }}</div>
        <TkInput
          id="name-input"
          v-model="form.username"
          required
        />
      </div>

      <div class="form-row">
        <div class="form-row-title">{{ $t('user.password') }}</div>
        <TkInput
          id="password-input"
          v-model="form.password"
          type="password"
          required
        />
      </div>
      <div class="form-row text-center">
        <TkButton type="submit">{{ $t('submit') }}</TkButton>
      </div>
    </form>
  </div>
</template>

<script >
import {getAuth} from '@/api/service'

export default {
  name: 'LoginPrompt',
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async submitLogin() {
      const {
        token
      } = await getAuth({
        username: this.form.username,
        password: this.form.password
      })
      this.$store.commit('setToken', token)
      this.$emit('loginSuccess')
    }
  }
}
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
    }
  }
}
</style>
