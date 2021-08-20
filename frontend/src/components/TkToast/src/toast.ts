import {createVNode, render, ComponentPublicInstance} from 'vue'
import {IToast, MessageQueue} from './type'

const instances: MessageQueue = []
let seed = 1

const Toast: IToast = function (opts) {
  if (typeof opts === 'string') {
    opts = {
      message: opts
    }
  }

  let options = opts
  let verticalOffset = opts.offset || 20
  instances.forEach(({vm}) => {
    verticalOffset += (vm.el.offsetHeight || 0) + 16
  })

  verticalOffset += 16
  const id = 'message_' + seed++

  options = {
    ...options,
    onClose: () => {
      close(id, userOnClose)
    },
    offset: verticalOffset,
    id,
    zIndex: PopupManager.nextZIndex(),
  }

}

export function close(id) {

}

export function closeAll() {
}

['success', 'warning', 'info', 'error'].forEach(type => {

})

Toast.closeAll = closeAll

export default Toast
