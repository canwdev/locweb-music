import {guid} from '@/utils'
import {WinOptions} from '@/components/CommonUI/ViewPortWindow/window-controller'

export interface ShortcutItem {
  name: string
  icon: string
  component: any
}

export const StartMenuAppList = [
  {name: 'iframe Browser'},
  {name: 'Music Player'},
  {name: 'File Manager'},
  // add more...
]

export const SystemAppList = [
  {name: 'Run...'},
  // add more...
]

export interface TaskItem {
  guid: string
  title: string
  icon: string
  winOptions: WinOptions | null // 窗口初始化大小和位置
  windowRef: any // ViewPortWindow $ref
}

export class TaskItem {
  constructor(options?: any = {}) {
    this.guid = guid()
    this.title = options.title
    this.icon = options.icon
    this.winOptions = options.winOptions
  }
}
