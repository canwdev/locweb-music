import {guid} from '@/utils'
import {WinOptions} from '@/components/CommonUI/ViewPortWindow/window-controller'
import {Component} from 'vue'

export interface ShortcutItem {
  title: string
  icon: string
  component: any // 动态引入组件
  winId: string | null // 窗口id，设置用于保存窗口的位置和大小
  winOptions: WinOptions | null // 窗口初始化大小和位置
  autostart: boolean // 是否自动启动
  singleInstance: boolean // 是否为单实例
}

export interface TaskItem {
  guid: string
  title: string
  icon: string
  winId: string | null
  winOptions: WinOptions | null // 窗口初始化大小和位置
  windowRef: any // ViewPortWindow $ref
  component: Component | null // defineAsyncComponent(() => import(''))
  minimized: boolean // 是否最小化
}

export class TaskItem {
  constructor(options: any = {}) {
    this.guid = guid()
    this.title = options.title
    this.icon = options.icon
    this.winId = options.winId
    this.winOptions = options.winOptions
    this.component = shallowRef(options.component)
    this.minimized = options.minimized || false
  }
}
