import {guid} from '@/utils'
import {WinOptions} from '@/components/CommonUI/ViewPortWindow/window-controller'
import {Component} from 'vue'

import IconFile from '@/assets/icons/shell32.dll(1).png'
import IconComputer from '@/assets/icons/shell32.dll(16).png'
import IconSettings from '@/assets/icons/shell32.dll(16826).png'
import IconMusic from '@/assets/icons/shell32.dll(237).png'
import IconBrowser from '@/assets/icons/iexplore.exe(7).png'

export interface ShortcutItem {
  title: string
  icon: string
  component: any // 动态引入组件
  winId: string | null // 窗口id，设置用于保存窗口的位置和大小
  winOptions: WinOptions | null // 窗口初始化大小和位置
  autostart: boolean // 是否自动启动
  singleInstance: boolean // 是否为单实例
}

export const SystemAppList = [
  {
    icon: IconSettings,
    title: 'Settings',
    winId: 'settings',
    winOptions: {
      top: '100px',
      left: '100px',
      width: '800px',
      height: '600px',
    },
    component: defineAsyncComponent(() => import('@/components/Apps/SettingsApp/index.vue')),
    singleInstance: true,
    autostart: true,
  },
]

export const StartMenuAppList = [
  {
    icon: IconComputer,
    title: 'File Manager',
    winId: 'fm',
    winOptions: {
      top: '100px',
      left: '100px',
      width: '500px',
      height: '600px',
    },
    component: defineAsyncComponent(() => import('@/components/Apps/FileManager/index.vue')),
    autostart: true,
  },
  {
    icon: IconMusic,
    title: 'Music Player',
    winId: 'player',
    component: defineAsyncComponent(() => import('@/components/Apps/MusicPlayer/index.vue')),
    autostart: true,
    singleInstance: true,
  },
  {
    icon: IconBrowser,
    title: 'Iframe Browser',
    component: defineAsyncComponent(() => import('@/components/Apps/IframeBrowser/index.vue')),
  },
  ...SystemAppList,
]

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
  constructor(options?: any = {}) {
    this.guid = guid()
    this.title = options.title
    this.icon = options.icon
    this.winId = options.winId
    this.winOptions = options.winOptions
    this.component = shallowRef(options.component)
    this.minimized = options.minimized || false
  }
}
