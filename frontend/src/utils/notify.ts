import Swal from 'sweetalert2'

window.$swal = Swal
window.$notify = {
  toast(config: any = {}, extraConfig = {}) {
    const {
      message,
      icon,
    } = config
    Swal.fire({
      toast: true,
      showConfirmButton: false,
      timer: 2000,
      icon,
      title: message,
      ...extraConfig
    })
  },
  info(message, customConfig = {}) {
    this.toast({
      icon: 'info',
      message,
    }, customConfig)
  },
  success(message, customConfig = {}) {
    this.toast({
      icon: 'success',
      message,
    }, customConfig)
  },
  warning(message, customConfig = {}) {
    this.toast({
      icon: 'warning',
      message,
    }, customConfig)
  },
  error(message, customConfig = {}) {
    this.toast({
      icon: 'error',
      message,
    }, customConfig)
  }
}

const commonConfig = {
  timeout: 1500
}

