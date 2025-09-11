// 设置类型定义文件
// 定义所有设置项的严格类型接口，提供类型安全保障

// 链接预览设置接口
export interface LinkPreviewSettings {
  // 触发方式：拖动链接、鼠标悬停、长按链接、修饰键+鼠标左键点击、修饰键+悬停、禁用
  triggerMethod: 'drag' | 'hover' | 'longPress' | 'click' | 'customHover' | 'disabled'
  // 自定义快捷键：Alt（Windows）、Cmd（macOS）、Shift（通用）
  customShortcut: 'Alt' | 'Cmd' | 'Shift'
  // 悬停延迟时间（秒）：0.1s - 3s
  hoverDelay: number
  // 长按延迟时间（秒）：0.2s - 3s
  longPressDelay: number
  // 弹窗大小：上次大小、小型、中型（默认）、大型
  popupSize: 'last' | 'small' | 'medium' | 'large'
  // 弹窗位置：上次位置、中央（默认）、左侧、右侧
  popupPosition: 'last' | 'center' | 'left' | 'right'
  // 背景不透明度：0% - 100%
  backgroundOpacity: number
  // 最大悬浮窗数量：1-6
  maxFloatingWindows: number
  // 是否默认固定新建的预览窗口
  autoPin: boolean
}

// 拖拽文本设置接口
export interface DragTextSettings {
  // 搜索引擎：必应、谷歌、百度、DuckDuckGo
  searchEngine: 'bing' | 'google' | 'baidu' | 'duckduckgo'
  // 自动打开链接：是/否
  autoOpenLink: boolean
  // 禁用网站列表（每行一个域名）
  disabledSites: string
}

// 主题设置接口
export interface ThemeSettings {
  // 主题：系统主题、浅色主题、深色主题
  theme: 'system' | 'light' | 'dark'
}

// 语言设置接口
export interface LanguageSettings {
  // 支持的语言列表
  language: 'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'ru' | 'it' | 'es' | 'pt' | 'ar'
}

// UI设置接口
export interface UISettings {
  // 当前激活的选项卡
  activeTab: 'linkPreview' | 'dragText' | 'other'
}

// 域名验证状态接口
export interface DomainValidation {
  // 是否有错误
  hasError: boolean
  // 错误消息
  errorMessage: string
  // 是否超出限制
  exceedsLimit: boolean
}

// 完整的应用设置接口
export interface AppSettings {
  linkPreviewSettings: LinkPreviewSettings
  dragTextSettings: DragTextSettings
  themeSettings: ThemeSettings
  languageSettings: LanguageSettings
  uiSettings: UISettings
}

// 设置存储键名类型
export type SettingsStorageKey = keyof AppSettings

// 设置变更事件类型
export type SettingsChangeEvent<T extends SettingsStorageKey> = {
  key: T
  oldValue: AppSettings[T]
  newValue: AppSettings[T]
}

// 获取平台默认修饰键的函数（延迟导入避免循环依赖）
const getDefaultShortcut = (): 'Alt' | 'Cmd' | 'Shift' => {
  // 在浏览器环境中检测平台
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent.toLowerCase()
    const platform = navigator.platform?.toLowerCase() || ''
    
    if (platform.includes('mac') || userAgent.includes('mac os')) {
      return 'Cmd'
    }
    if (platform.includes('win') || userAgent.includes('windows')) {
      return 'Alt'
    }
  }
  return 'Alt' // 默认值
}

// 默认设置配置
export const DEFAULT_SETTINGS: AppSettings = {
  linkPreviewSettings: {
    triggerMethod: 'drag',
    customShortcut: getDefaultShortcut(),
    hoverDelay: 0.2,
    longPressDelay: 0.5,
    // 首次打开：中型 + 居中
    popupSize: 'medium',
    popupPosition: 'center',
    backgroundOpacity: 60,
    maxFloatingWindows: 3,
    autoPin: false,
  },
  dragTextSettings: {
    searchEngine: 'bing',
    autoOpenLink: false,
    disabledSites: ''
  },
  themeSettings: {
    theme: 'system'
  },
  languageSettings: {
    language: 'zh-CN'
  },
  uiSettings: {
    activeTab: 'linkPreview'
  }
}

// 设置验证函数类型
export type SettingsValidator<T> = (value: T) => boolean

// 设置验证器映射
export interface SettingsValidators {
  linkPreviewSettings: {
    hoverDelay: SettingsValidator<number>
    longPressDelay: SettingsValidator<number>
    backgroundOpacity: SettingsValidator<number>
    maxFloatingWindows: SettingsValidator<number>
  }
  dragTextSettings: {
    disabledSites: SettingsValidator<string>
  }
}

// 设置验证器实现
export const SETTINGS_VALIDATORS: SettingsValidators = {
  linkPreviewSettings: {
    hoverDelay: (value: number) => value >= 0.1 && value <= 3,
    longPressDelay: (value: number) => value >= 0.2 && value <= 3,
    backgroundOpacity: (value: number) => value >= 0 && value <= 100,
    maxFloatingWindows: (value: number) => value >= 1 && value <= 6,
  },
  dragTextSettings: {
    disabledSites: (value: string) => {
      if (!value.trim()) return true
      const domains = value.split('\n').filter(line => line.trim())
      if (domains.length > 10) return false
      
      const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+([a-zA-Z]{2,})$/
      return domains.every(domain => domainRegex.test(domain.trim()))
    }
  }
}