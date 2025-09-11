// 设置管理Hook
// 提供统一的设置管理接口，包含增量保存、深度比较、错误处理等功能

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  AppSettings,
  SettingsStorageKey,
  DEFAULT_SETTINGS,
  SETTINGS_VALIDATORS,
  DomainValidation
} from '@/types/settings'

// 设置管理Hook的返回类型
interface UseSettingsManagerReturn {
  // 所有设置数据
  settings: AppSettings
  // 是否正在加载
  isLoading: boolean
  // 是否已初始化
  isInitialized: boolean
  // 域名验证状态
  domainValidation: DomainValidation
  // 更新单个设置项
  updateSetting: <T extends SettingsStorageKey>(key: T, value: Partial<AppSettings[T]>) => void
  // 批量更新设置
  updateSettings: (updates: Partial<AppSettings>) => void
  // 重置所有设置
  resetSettings: () => void
  // 验证域名
  validateDomains: (domainsText: string) => boolean
  // 等待下一次实际保存完成（有变更并成功写入存储）
  waitForNextSave: () => Promise<boolean>
}

// 深度比较函数 - 检测对象是否发生变化
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true
  
  if (obj1 == null || obj2 == null) return false
  
  if (typeof obj1 !== typeof obj2) return false
  
  if (typeof obj1 !== 'object') return obj1 === obj2
  
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  
  if (keys1.length !== keys2.length) return false
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false
    if (!deepEqual(obj1[key], obj2[key])) return false
  }
  
  return true
}

// 获取变更的设置项 - 实现增量保存
function getChangedSettings(
  oldSettings: AppSettings,
  newSettings: AppSettings
): Partial<AppSettings> {
  const changes: Partial<AppSettings> = {}
  
  for (const key in newSettings) {
    const settingsKey = key as keyof AppSettings
    if (!deepEqual(oldSettings[settingsKey], newSettings[settingsKey])) {
      (changes as any)[settingsKey] = newSettings[settingsKey]
    }
  }
  
  return changes
}

// 浏览器存储工具函数
class StorageManager {
  // 保存单个设置到存储
  static async saveSetting<T extends SettingsStorageKey>(
    key: T,
    value: AppSettings[T]
  ): Promise<void> {
    try {
      if (typeof browser === 'undefined' || !browser.storage) {
        console.warn('Browser storage API not available')
        return
      }
      
      await browser.storage.local.set({ [key]: value })
      console.log(`设置已保存: ${key}`, value)
    } catch (error) {
      console.error(`保存设置失败: ${key}`, error)
      throw error
    }
  }
  
  // 批量保存设置到存储 - 增量保存实现
  static async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    try {
      if (typeof browser === 'undefined' || !browser.storage) {
        console.warn('Browser storage API not available')
        return
      }
      
      // 只保存发生变化的设置项
      const settingsToSave: Record<string, any> = {}
      Object.entries(settings).forEach(([key, value]) => {
        settingsToSave[key] = value
      })
      
      if (Object.keys(settingsToSave).length > 0) {
        await browser.storage.local.set(settingsToSave)
        console.log('增量设置保存完成:', Object.keys(settingsToSave))
      }
    } catch (error) {
      console.error('批量保存设置失败', error)
      throw error
    }
  }
  
  // 从存储加载单个设置
  static async loadSetting<T extends SettingsStorageKey>(
    key: T,
    defaultValue: AppSettings[T]
  ): Promise<AppSettings[T]> {
    try {
      if (typeof browser === 'undefined' || !browser.storage) {
        console.warn('Browser storage API not available, using default')
        return defaultValue
      }
      
      const result = await browser.storage.local.get([key])
      const savedValue = result[key]
      
      if (savedValue) {
        console.log(`设置已加载: ${key}`, savedValue)
        // 合并默认设置和保存的设置，确保新增的配置项有默认值
        return { ...defaultValue, ...savedValue }
      }
      
      return defaultValue
    } catch (error) {
      console.error(`加载设置失败: ${key}`, error)
      return defaultValue
    }
  }
  
  // 加载所有设置
  static async loadAllSettings(): Promise<AppSettings> {
    try {
      const [linkPreviewSettings, dragTextSettings, themeSettings, languageSettings, uiSettings] = await Promise.all([
        StorageManager.loadSetting('linkPreviewSettings', DEFAULT_SETTINGS.linkPreviewSettings),
        StorageManager.loadSetting('dragTextSettings', DEFAULT_SETTINGS.dragTextSettings),
        StorageManager.loadSetting('themeSettings', DEFAULT_SETTINGS.themeSettings),
        StorageManager.loadSetting('languageSettings', DEFAULT_SETTINGS.languageSettings),
        StorageManager.loadSetting('uiSettings', DEFAULT_SETTINGS.uiSettings)
      ])
      
      return {
        linkPreviewSettings,
        dragTextSettings,
        themeSettings,
        languageSettings,
        uiSettings
      }
    } catch (error) {
      console.error('加载所有设置失败', error)
      return DEFAULT_SETTINGS
    }
  }
}

// 域名验证工具函数
class DomainValidator {
  // 验证单个域名格式
  static validateDomain(domain: string): boolean {
    // 支持一级域名和二级域名格式
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+([a-zA-Z]{2,})$/
    return domainRegex.test(domain)
  }
  
  // 验证域名列表
  static validateDomainList(domainsText: string): DomainValidation {
    if (!domainsText.trim()) {
      return { hasError: false, errorMessage: '', exceedsLimit: false }
    }
    
    const lines = domainsText.split('\n').filter(line => line.trim())
    const invalidDomains: string[] = []
    
    lines.forEach(line => {
      const domain = line.trim()
      if (domain && !DomainValidator.validateDomain(domain)) {
        invalidDomains.push(domain)
      }
    })
    
    const exceedsLimit = lines.length > 10
    const hasError = invalidDomains.length > 0
    
    return {
      hasError,
      errorMessage: hasError ? `无效域名: ${invalidDomains.join(', ')}` : '',
      exceedsLimit
    }
  }
}

// 设置管理Hook主函数
export function useSettingsManager(): UseSettingsManagerReturn {
  // 设置状态
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [domainValidation, setDomainValidation] = useState<DomainValidation>({
    hasError: false,
    errorMessage: '',
    exceedsLimit: false
  })
  
  // 用于防抖保存的引用
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousSettingsRef = useRef<AppSettings>(DEFAULT_SETTINGS)
  // 用于等待下一次保存完成的Promise集合
  const saveResolversRef = useRef<Array<(ok: boolean) => void>>([])
  // 统一resolve并清空等待者
  const resolveAndClearSaveResolvers = (ok: boolean) => {
    if (saveResolversRef.current.length > 0) {
      saveResolversRef.current.forEach((resolve) => {
        try { resolve(ok) } catch {}
      })
      saveResolversRef.current = []
    }
  }
  
  // 初始化加载设置
  useEffect(() => {
    const initializeSettings = async () => {
      try {
        setIsLoading(true)
        const loadedSettings = await StorageManager.loadAllSettings()
  
        // 迁移兼容：将历史值映射到新枚举（popupSize/popupPosition）
        const mapSize: Record<string, 'last' | 'small' | 'medium' | 'large'> = {
          lastSize: 'last',
          defaultSize: 'medium',
          contentAdaptive: 'medium',
          default: 'medium',
          adaptive: 'medium'
        }
        const mapPosition: Record<string, 'last' | 'center' | 'left' | 'right'> = {
          followMouse: 'center',
          topRight: 'right',
          default: 'center'
        }
        const originalLP = loadedSettings.linkPreviewSettings
        const migratedLP = {
          ...originalLP,
          popupSize: mapSize[originalLP.popupSize as string] || originalLP.popupSize,
          popupPosition: mapPosition[originalLP.popupPosition as string] || originalLP.popupPosition
        }
        const finalSettings =
          migratedLP.popupSize !== originalLP.popupSize || migratedLP.popupPosition !== originalLP.popupPosition
            ? { ...loadedSettings, linkPreviewSettings: migratedLP }
            : loadedSettings
  
        // 若发生迁移，落盘保存，避免下次再次迁移
        if (finalSettings !== loadedSettings) {
          try {
            await StorageManager.saveSetting('linkPreviewSettings', migratedLP as any)
          } catch (e) {
            console.warn('保存迁移后的 linkPreviewSettings 失败，不影响继续使用', e)
          }
        }
  
        setSettings(finalSettings)
        previousSettingsRef.current = finalSettings
        console.log('所有设置已初始化完成')
      } catch (error) {
        console.error('初始化设置失败:', error)
        // 发生错误时使用默认设置
        setSettings(DEFAULT_SETTINGS)
        previousSettingsRef.current = DEFAULT_SETTINGS
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }
  
    initializeSettings()
  }, [])
  
  // 防抖保存设置 - 实现增量保存
  const debouncedSave = useCallback((newSettings: AppSettings) => {
    if (!isInitialized) return
    
    // 清除之前的定时器
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    // 设置新的防抖定时器
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        // 获取变更的设置项
        const changedSettings = getChangedSettings(previousSettingsRef.current, newSettings)
        
        // 只有当有变更时才保存
        if (Object.keys(changedSettings).length > 0) {
          await StorageManager.saveSettings(changedSettings)
          previousSettingsRef.current = newSettings
          console.log('增量保存完成，变更项:', Object.keys(changedSettings))
          // 成功保存，通知等待者
          resolveAndClearSaveResolvers(true)
        } else {
          // 无实际变更，不显示成功提示
          resolveAndClearSaveResolvers(false)
        }
      } catch (error) {
        console.error('保存设置失败:', error)
        // 失败时通知等待者（false）
        resolveAndClearSaveResolvers(false)
      }
    }, 300) // 300ms防抖延迟
  }, [isInitialized])
  
  // 更新单个设置项
  const updateSetting = useCallback(<T extends SettingsStorageKey>(
    key: T,
    value: Partial<AppSettings[T]>
  ) => {
    setSettings(prevSettings => {
      const newSettings = {
        ...prevSettings,
        [key]: { ...prevSettings[key], ...value }
      }
      
      // 触发防抖保存
      debouncedSave(newSettings)
      
      return newSettings
    })
  }, [debouncedSave])
  
  // 批量更新设置
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prevSettings => {
      const newSettings = { ...prevSettings }
      
      // 合并更新
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          const settingsKey = key as SettingsStorageKey
          (newSettings as any)[settingsKey] = {
            ...newSettings[settingsKey],
            ...value
          }
        }
      })
      
      // 触发防抖保存
      debouncedSave(newSettings)
      
      return newSettings
    })
  }, [debouncedSave])
  
  // 重置所有设置
  const resetSettings = useCallback(async () => {
    try {
      setSettings(DEFAULT_SETTINGS)
      await StorageManager.saveSettings(DEFAULT_SETTINGS)
      previousSettingsRef.current = DEFAULT_SETTINGS
      console.log('设置已重置为默认值')
      // 重置为默认值后也算一次成功保存
      resolveAndClearSaveResolvers(true)
    } catch (error) {
      console.error('重置设置失败:', error)
      resolveAndClearSaveResolvers(false)
    }
  }, [])
  
  // 验证域名
  const validateDomains = useCallback((domainsText: string): boolean => {
    const validation = DomainValidator.validateDomainList(domainsText)
    setDomainValidation(validation)
    return !validation.hasError && !validation.exceedsLimit
  }, [])
  
  // 提供等待下一次保存结果的Promise
  const waitForNextSave = useCallback((): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      saveResolversRef.current.push(resolve)
    })
  }, [])
  
  // 清理定时器
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])
  
  return {
    settings,
    isLoading,
    isInitialized,
    domainValidation,
    updateSetting,
    updateSettings,
    resetSettings,
    validateDomains,
    waitForNextSave
  }
}

export default useSettingsManager