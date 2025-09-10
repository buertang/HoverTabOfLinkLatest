import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 检测操作系统平台
export function getPlatform(): 'macos' | 'windows' | 'other' {
  if (typeof navigator === 'undefined') return 'other'
  
  const userAgent = navigator.userAgent.toLowerCase()
  const platform = navigator.platform?.toLowerCase() || ''
  
  // 检测 macOS
  if (platform.includes('mac') || userAgent.includes('mac os')) {
    return 'macos'
  }
  
  // 检测 Windows
  if (platform.includes('win') || userAgent.includes('windows')) {
    return 'windows'
  }
  
  return 'other'
}

// 根据平台获取可用的修饰键选项
export function getAvailableModifierKeys(platform: ReturnType<typeof getPlatform> = getPlatform()): Array<'Alt' | 'Cmd' | 'Shift'> {
  switch (platform) {
    case 'macos':
      return ['Cmd', 'Shift']
    case 'windows':
      return ['Alt', 'Shift']
    default:
      // 其他平台默认显示所有选项
      return ['Alt', 'Cmd', 'Shift']
  }
}

// 根据平台获取默认修饰键
export function getDefaultModifierKey(platform: ReturnType<typeof getPlatform> = getPlatform()): 'Alt' | 'Cmd' | 'Shift' {
  switch (platform) {
    case 'macos':
      return 'Cmd'
    case 'windows':
      return 'Alt'
    default:
      return 'Alt'
  }
}
