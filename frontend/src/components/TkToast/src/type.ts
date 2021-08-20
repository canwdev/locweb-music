import type { VNode } from 'vue'

export interface IToast {
  closeAll(): void;
}

export type MessageVM = VNode

type MessageQueueItem = {
  vm: MessageVM;
}

export type MessageQueue = Array<MessageQueueItem>
