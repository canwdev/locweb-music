<template>
  <div class="login-wrap settings-form">
    <div class="settings-title">
      {{ $t('user.login') }}
    </div>

    <form ref="form" @submit.stop.prevent="submitLogin">
      <div class="settings-content">
        <div class="settings-row multi-line">
          <div class="s-label">{{ $t('user.username') }}</div>
          <div class="s-actions">
            <TkInput
              id="name-input"
              v-model="form.username"
              required
            />
          </div>

        </div>

        <div class="settings-row multi-line">
          <div class="s-label">{{ $t('user.password') }}</div>
          <div class="s-actions">
            <TkInput
              id="password-input"
              v-model="form.password"
              type="password"
              required
            />
          </div>
        </div>
      </div>
      <div class="action-btn-row">
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
  width: 300px;
  .form-row {
    .form-row-title {
      font-size: 14px;
    }
  }
}
</style>
