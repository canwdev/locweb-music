import IconComputer from '@/assets/icons/shell32.dll(16).png'
import IconMusic from '@/assets/icons/shell32.dll(237).png'
import IconBrowser from '@/assets/icons/iexplore.exe(7).png'
import IconSettings from '@/assets/icons/shell32.dll(16826).png'

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
    autostart: false,
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
    autostart: false,
  },
  {
    icon: IconMusic,
    title: 'Music Player',
    winId: 'player',
    component: defineAsyncComponent(() => import('@/components/Apps/MusicPlayer/index.vue')),
    autostart: false,
    singleInstance: true,
  },
  {
    icon: IconBrowser,
    title: 'Iframe Browser',
    component: defineAsyncComponent(() => import('@/components/Apps/IframeBrowser/index.vue')),
  },
  ...SystemAppList,
]