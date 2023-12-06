// 选项Item
export interface StOptionItem {
  label: string // 选项标题
  key: string // 选项对应后端配置键值
  store?: any // 定义store属性（如settingsStore），传入此值后无需传入value，将根据key动态读写store属性
  value?: boolean | string | number // 选项实际值
  type?: StOptionType
  selectOptions?: any[] // 当type为 SELECT | MULTIPLE_SWITCH 时，选项的下拉数据
  disabled?: boolean // 是否已禁用
  children?: StOptionItem[]
  icon?: string // 图标
  subtitle?: string // 小标题
  cls?: string // 自定义类名
}

// 选项的类型
export enum StOptionType {
  SWITCH = 'switch',
  MULTIPLE_SWITCH = 'multiple_switch',
  SLIDER = 'slider',
  SELECT = 'select',
}

export type SwitchOption = {
  label: string
  value: string
}

export enum LdThemeType {
  SYSTEM = 0,
  LIGHT = 1,
  DARK = 2,
}

export const ldThemeOptions = [
  {
    label: 'System',
    value: LdThemeType.SYSTEM,
  },
  {
    label: 'Light',
    value: LdThemeType.LIGHT,
  },
  {
    label: 'Dark',
    value: LdThemeType.DARK,
  },
]

export enum CustomThemeType {
  DEFAULT = 'theme-default',
  WIN8 = 'theme-win8',
  CLASSIC = 'theme-classic',
  MINIMALISM = 'theme-minimalism',
}

export const customThemeOptions = [
  {
    label: 'Default',
    value: CustomThemeType.DEFAULT,
  },
  {
    label: 'Minimalism',
    value: CustomThemeType.MINIMALISM,
  },
  {
    label: 'Win8',
    value: CustomThemeType.WIN8,
  },
  {
    label: 'Classic',
    value: CustomThemeType.CLASSIC,
  },
]

export enum LoopModeType {
  NONE = 1, // Play stops after last track
  LOOP_SEQUENCE = 2, // Sequence play
  LOOP_REVERSE = 3, // Reverse play
  LOOP_SINGLE = 4, // Single cycle
  SHUFFLE = 5, // Shuffle next
}

export const LoopModeTypeValues = [
  LoopModeType.NONE,
  LoopModeType.LOOP_SEQUENCE,
  LoopModeType.LOOP_REVERSE,
  LoopModeType.LOOP_SINGLE,
  LoopModeType.SHUFFLE,
]

export const loopModeMap = {
  [LoopModeType.NONE]: {
    value: LoopModeType.NONE,
    icon: 'arrow_forward',
    i18nKey: 'msg.play-in-order',
  },
  [LoopModeType.SHUFFLE]: {
    value: LoopModeType.SHUFFLE,
    icon: 'shuffle',
    i18nKey: 'shuffle',
  },
  [LoopModeType.LOOP_SEQUENCE]: {
    value: LoopModeType.LOOP_SEQUENCE,
    icon: 'repeat',
    i18nKey: 'msg.sequential-loop',
  },
  [LoopModeType.LOOP_REVERSE]: {
    value: LoopModeType.LOOP_REVERSE,
    icon: 'repeat',
    className: 'reverse-x',
    i18nKey: 'msg.reverse-loop',
  },
  [LoopModeType.LOOP_SINGLE]: {
    value: LoopModeType.LOOP_SINGLE,
    icon: 'repeat_one',
    i18nKey: 'msg.single-cycle',
  },
}
