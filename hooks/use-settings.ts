import { storage } from '#imports'
import { useEffect, useState } from 'react'

type Theme = 'system' | 'light' | 'dark'
type FloatingPreviewTheme = 'light' | 'dark' | 'blue' | 'red' | 'yellow' | 'green'
type FloatingPreviewPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'

interface AppearanceSettings {
  theme: Theme
}

interface SystemSettings {
  notifications: boolean
  syncInterval: number
}

interface UISettings {
  activeTab: string
}

interface FloatingPreviewSettings {
  enabled: boolean
  theme: FloatingPreviewTheme
  position: FloatingPreviewPosition
  width: number
  height: number
  opacity: number
  dragToTrigger: boolean
  showOnHover: boolean
  hoverDelay: number
  autoClose: boolean
  autoCloseDelay: number
}

// Define storage items
const appearanceSettings = storage.defineItem<AppearanceSettings>('local:appearanceSettings', {
  fallback: {
    theme: 'system'
  }
})

const systemSettings = storage.defineItem<SystemSettings>('local:systemSettings', {
  fallback: {
    notifications: true,
    syncInterval: 15
  }
})

const uiSettings = storage.defineItem<UISettings>('local:uiSettings', {
  fallback: {
    activeTab: 'home'
  }
})

const floatingPreviewSettings = storage.defineItem<FloatingPreviewSettings>('local:floatingPreviewSettings', {
  fallback: {
    enabled: true,
    theme: 'light',
    position: 'center',
    width: 800,
    height: 600,
    opacity: 0.95,
    dragToTrigger: true,
    showOnHover: false,
    hoverDelay: 500,
    autoClose: true,
    autoCloseDelay: 5000
  }
})

export function useSettings() {
  const [appearance, setAppearance] = useState<AppearanceSettings>({ theme: 'system' })
  const [system, setSystem] = useState<SystemSettings>({ notifications: true, syncInterval: 15 })
  const [ui, setUI] = useState<UISettings>({ activeTab: 'home' })
  const [floatingPreview, setFloatingPreview] = useState<FloatingPreviewSettings>({
    enabled: true,
    theme: 'light',
    position: 'center',
    width: 800,
    height: 600,
    opacity: 0.95,
    dragToTrigger: true,
    showOnHover: false,
    hoverDelay: 500,
    autoClose: true,
    autoCloseDelay: 5000
  })
  const [loading, setLoading] = useState(true)

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [appearanceData, systemData, uiData, floatingPreviewData] = await Promise.all([
          appearanceSettings.getValue(),
          systemSettings.getValue(),
          uiSettings.getValue(),
          floatingPreviewSettings.getValue()
        ])
        
        setAppearance(appearanceData)
        setSystem(systemData)
        setUI(uiData)
        setFloatingPreview(floatingPreviewData)
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  // Update appearance settings
  const updateAppearance = async (updates: Partial<AppearanceSettings>) => {
    const newSettings = { ...appearance, ...updates }
    setAppearance(newSettings)
    try {
      await appearanceSettings.setValue(newSettings)
    } catch (error) {
      console.error('Failed to save appearance settings:', error)
    }
  }

  // Update system settings
  const updateSystem = async (updates: Partial<SystemSettings>) => {
    const newSettings = { ...system, ...updates }
    setSystem(newSettings)
    try {
      await systemSettings.setValue(newSettings)
    } catch (error) {
      console.error('Failed to save system settings:', error)
    }
  }

  // Update UI settings
  const updateUI = async (updates: Partial<UISettings>) => {
    const newSettings = { ...ui, ...updates }
    setUI(newSettings)
    try {
      await uiSettings.setValue(newSettings)
    } catch (error) {
      console.error('Failed to save UI settings:', error)
    }
  }

  // Update FloatingPreview settings
  const updateFloatingPreview = async (updates: Partial<FloatingPreviewSettings>) => {
    const newSettings = { ...floatingPreview, ...updates }
    setFloatingPreview(newSettings)
    try {
      await floatingPreviewSettings.setValue(newSettings)
    } catch (error) {
      console.error('Failed to save floating preview settings:', error)
    }
  }

  // Reset all settings
  const resetSettings = async () => {
    try {
      await Promise.all([
        appearanceSettings.removeValue(),
        systemSettings.removeValue(),
        uiSettings.removeValue(),
        floatingPreviewSettings.removeValue()
      ])
      
      // Reset to default values
      const defaultAppearance = { theme: 'system' as Theme }
      const defaultSystem = { notifications: true, syncInterval: 15 }
      const defaultUI = { activeTab: 'home' }
      const defaultFloatingPreview = {
        enabled: true,
        theme: 'light' as FloatingPreviewTheme,
        position: 'center' as FloatingPreviewPosition,
        width: 800,
        height: 600,
        opacity: 0.95,
        dragToTrigger: true,
        showOnHover: false,
        hoverDelay: 500,
        autoClose: true,
        autoCloseDelay: 5000
      }
      
      setAppearance(defaultAppearance)
      setSystem(defaultSystem)
      setUI(defaultUI)
      setFloatingPreview(defaultFloatingPreview)
    } catch (error) {
      console.error('Failed to reset settings:', error)
    }
  }

  return {
    appearance,
    system,
    ui,
    floatingPreview,
    loading,
    updateAppearance,
    updateSystem,
    updateUI,
    updateFloatingPreview,
    resetSettings
  }
}
