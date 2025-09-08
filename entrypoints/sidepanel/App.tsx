import React from 'react'
import { useAppConfig } from '#imports'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from '@/hooks/use-theme'
import { useTranslation } from '@/hooks/use-i18n'
import { useSettingsManager } from '@/hooks/use-settings-manager'
import { Language } from '@/lib/i18n'
import { DelaySlider } from './components/DelaySlider'
import { LabelSelect } from './components/LabelSelect'
import {
  Heart,
  Link,
  MousePointer,
  Languages,
  Monitor,
  Moon,
  Sun,
  Eye,
  Hand,
  Settings,
  Palette,
  Globe,
  Shield,
  Zap,
  Clock,
  Move,
  Layers,
} from 'lucide-react'

function App() {
  const config = useAppConfig()
  const { appearance, system, ui, loading, updateAppearance, updateSystem, updateUI, resetSettings } = useSettings()
  const { t, language, setLanguage, isLoading: i18nLoading } = useTranslation()
  
  // 使用新的设置管理Hook
  const {
    settings,
    isLoading: settingsLoading,
    isInitialized,
    domainValidation,
    updateSetting,
    updateSettings,
    resetSettings: resetAllSettings,
    validateDomains
  } = useSettingsManager()
  
  // 确保默认显示链接预览设置Tab
  React.useEffect(() => {
    if (!settings.uiSettings.activeTab || !['linkPreview', 'dragText', 'other'].includes(settings.uiSettings.activeTab)) {
      updateSetting('uiSettings', { activeTab: 'linkPreview' })
    }
  }, [settings.uiSettings.activeTab, updateSetting])
  
  const { resolvedTheme, setTheme } = useTheme({
    theme: settings.themeSettings.theme,
    onThemeChange: (theme) => {updateSetting('themeSettings', { theme }),updateAppearance({ theme })}
  })

  // 同步语言设置
  React.useEffect(() => {
    if (isInitialized && settings.languageSettings.language !== language) {
      setLanguage(settings.languageSettings.language as Language)
    }
  }, [settings.languageSettings.language, language, setLanguage, isInitialized])

  // 域名验证逻辑现在由 useSettingsManager Hook 处理

  // Language settings now managed by useTranslation hook

  // 主题选项配置（参考根目录App.tsx的实现）
  const themeOptions = [
    { value: 'system', label: t.other.themes.system, icon: Monitor },
    { value: 'light', label: t.other.themes.light, icon: Sun },
    { value: 'dark', label: t.other.themes.dark, icon: Moon }
  ] as const

  const handleTabChange = (value: string) => {
    updateSetting('uiSettings', { activeTab: value as 'linkPreview' | 'dragText' | 'other' })
  }

  if (loading || i18nLoading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background min-w-[430px]">
      {/* Header */}
      <div className="border-none px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">HoverTabOfLink</h1>
            <p className="text-sm text-muted-foreground">
              {t.appDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden border-none">
        <Tabs value={settings.uiSettings.activeTab} onValueChange={handleTabChange} className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <TabsTrigger value="linkPreview" className="flex items-center justify-center p-3 w-full">
                    <Link className="h-4 w-4" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.tabs.linkPreview.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <TabsTrigger value="dragText" className="flex items-center justify-center p-3 w-full">
                    <MousePointer className="h-4 w-4" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.tabs.dragText.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <TabsTrigger value="other" className="flex items-center justify-center p-3 w-full">
                    <Settings className="h-4 w-4" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.tabs.other.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsList>

          <TabsContent value="linkPreview" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-6 p-6">
              <LabelSelect
                label={t.linkPreview.enableLabel}
                value={settings.linkPreviewSettings.triggerMethod}
                onChange={(value) => updateSetting('linkPreviewSettings', { triggerMethod: value as 'drag' | 'hover' | 'longPress' | 'click' | 'customHover' | 'disabled' })}
                options={[
                  { value: 'drag', label: t.linkPreview.triggerMethods.drag },
                  { value: 'hover', label: t.linkPreview.triggerMethods.hover },
                  { value: 'longPress', label: t.linkPreview.triggerMethods.longPress },
                  { 
                    value: 'click', 
                    label: `${t.linkPreview.shortcutKeys[settings.linkPreviewSettings.customShortcut?.toLowerCase() as keyof typeof t.linkPreview.shortcutKeys] || t.linkPreview.shortcutKeys.alt}+${t.linkPreview.clickText}`
                  },
                  { 
                    value: 'customHover', 
                    label: `${t.linkPreview.shortcutKeys[settings.linkPreviewSettings.customShortcut?.toLowerCase() as keyof typeof t.linkPreview.shortcutKeys] || t.linkPreview.shortcutKeys.alt}+${t.linkPreview.hoverText}`
                  },
                  { value: 'disabled', label: t.linkPreview.triggerMethods.disabled }
                ]}
              />

              {(settings.linkPreviewSettings.triggerMethod === 'click' || settings.linkPreviewSettings.triggerMethod === 'customHover') && (
                    <LabelSelect
                      label={t.linkPreview.shortcutKeyLabel}
                      value={settings.linkPreviewSettings.customShortcut}
                      onChange={(value) => updateSetting('linkPreviewSettings', { customShortcut: value as 'Alt' | 'Ctrl' | 'Shift' })}
                      options={[
                        { value: 'Alt', label: t.linkPreview.shortcutKeys.alt },
                        { value: 'Ctrl', label: t.linkPreview.shortcutKeys.ctrl },
                        { value: 'Shift', label: t.linkPreview.shortcutKeys.shift }
                      ]}
                    />
                  )}

              {settings.linkPreviewSettings.triggerMethod === 'hover' && (
                 <DelaySlider
                   label={t.linkPreview.delayLabel}
                   value={settings.linkPreviewSettings.hoverDelay}
                   onChange={(value) => updateSetting('linkPreviewSettings', { hoverDelay: value })}
                   min={100}
                   max={2000}
                   step={50}
                   unit="ms"
                 />
               )}

               {settings.linkPreviewSettings.triggerMethod === 'longPress' && (
                 <DelaySlider
                   label={t.linkPreview.longPressDelayLabel}
                   value={settings.linkPreviewSettings.longPressDelay}
                   onChange={(value) => updateSetting('linkPreviewSettings', { longPressDelay: value })}
                   min={200}
                   max={3000}
                   step={100}
                   unit="ms"
                 />
               )}

              {settings.linkPreviewSettings.triggerMethod === 'customHover' && (
                 <DelaySlider
                   label={t.linkPreview.delayLabel}
                   value={settings.linkPreviewSettings.hoverDelay}
                   onChange={(value) => updateSetting('linkPreviewSettings', { hoverDelay: value })}
                   min={100}
                   max={2000}
                   step={50}
                   unit="ms"
                 />
               )}

              <LabelSelect
                label={t.linkPreview.sizeLabel}
                value={settings.linkPreviewSettings.popupSize}
                onChange={(value) => updateSetting('linkPreviewSettings', { popupSize: value as 'lastSize' | 'default' | 'adaptive' })}
                options={[
                  { value: 'lastSize', label: t.linkPreview.popupSizes.lastSize },
                  { value: 'default', label: t.linkPreview.popupSizes.defaultSize },
                  { value: 'adaptive', label: t.linkPreview.popupSizes.contentAdaptive }
                ]}
              />

              <LabelSelect
                label={t.linkPreview.positionLabel}
                value={settings.linkPreviewSettings.popupPosition}
                onChange={(value) => updateSetting('linkPreviewSettings', { popupPosition: value as 'followMouse' | 'center' | 'topRight' })}
                options={[
                  { value: 'followMouse', label: t.linkPreview.popupPositions.followMouse },
                  { value: 'center', label: t.linkPreview.popupPositions.center },
                  { value: 'topRight', label: t.linkPreview.popupPositions.topRight }
                ]}
              />



              <DelaySlider
                label={t.linkPreview.opacityLabel}
                value={settings.linkPreviewSettings.backgroundOpacity}
                onChange={(value) => updateSetting('linkPreviewSettings', { backgroundOpacity: value })}
                min={0}
                max={100}
                step={5}
                unit="%"
              />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="dragText" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold text-foreground">{t.dragText.enableLabel}</Label>
                <p className="text-xs text-muted-foreground">
                  {t.dragText.enableDescription}
                </p>
              </div>
              <Switch
                checked={settings.dragTextSettings.autoOpenLink}
                onCheckedChange={(checked) => updateSetting('dragTextSettings', { autoOpenLink: checked })}
              />
            </div>

            <div className="space-y-6">
              <LabelSelect
                label={t.dragText.searchEngineLabel}
                value={settings.dragTextSettings.searchEngine}
                onChange={(value) => updateSetting('dragTextSettings', { searchEngine: value as 'bing' | 'google' | 'baidu' | 'duckduckgo' })}
                disabled={!settings.dragTextSettings.autoOpenLink}
                options={[
                  { value: 'bing', label: t.dragText.searchEngines.bing },
                  { value: 'google', label: t.dragText.searchEngines.google },
                  { value: 'baidu', label: t.dragText.searchEngines.baidu },
                  { value: 'duckduckgo', label: t.dragText.searchEngines.duckduckgo }
                ]}
              />

              <div className="space-y-3">
                <Label className="text-base font-semibold text-foreground">{t.dragText.disabledSitesLabel}</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  {t.dragText.disabledSitesDescription}
                </p>
                <div className="space-y-2">
                  <Textarea
                    value={settings.dragTextSettings.disabledSites}
                    onChange={(e) => {
                      const value = e.target.value
                      updateSetting('dragTextSettings', { disabledSites: value })
                      
                      // 实时验证域名
                      if (value.trim()) {
                        validateDomains(value)
                      }
                    }}
                    placeholder={t.dragText.disabledSitesPlaceholder}
                    className={`min-h-[120px] resize-none text-xs ${
                      domainValidation.hasError || domainValidation.exceedsLimit 
                        ? 'border-red-500 focus:border-red-500' 
                        : ''
                    }`}
                  />
                  
                  {/* 域名格式提示 */}
                  <p className="text-xs text-muted-foreground">
                    {t.dragText.domainFormatHint}
                  </p>
                  
                  {/* 域名数量提示 */}
                  {settings.dragTextSettings.disabledSites.trim() && (
                    <p className={`text-xs ${
                      domainValidation.exceedsLimit ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                      {t.dragText.domainCountHint.replace('{count}', 
                        settings.dragTextSettings.disabledSites.split('\n').filter(line => line.trim()).length.toString()
                      )}
                    </p>
                  )}
                  
                  {/* 域名格式错误提示 */}
                  {domainValidation.hasError && (
                    <p className="text-xs text-red-500">
                      {domainValidation.errorMessage}
                    </p>
                  )}
                  
                  {/* 超限提示 */}
                  {domainValidation.exceedsLimit && (
                    <p className="text-xs text-red-500">
                      {t.dragText.exceedsLimitError}
                    </p>
                  )}
                </div>
              </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="other" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-6">
            <div className="space-y-6">
              {/* 主题设置 */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold text-foreground">{t.other.themeLabel}</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.other.themeDescription}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {themeOptions.map((option) => {
                    const Icon = option.icon
                    const isActive = appearance.theme === option.value
                    return (
                      <Button
                        key={option.value}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          // 同时更新useTheme钩子和本地状态
                          setTheme(option.value)
                          updateSetting('themeSettings', { theme: option.value })
                        }}
                        className="flex flex-col gap-1 h-auto py-3"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{option.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>

              <Separator />

              {/* 通知设置 */}
              {/* <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">通知提醒</Label>
                  <p className="text-sm text-muted-foreground">
                    启用桌面通知和提醒功能
                  </p>
                </div>
                <Switch
                  checked={system.notifications}
                  onCheckedChange={(checked) => updateSystem({ notifications: checked })}
                />
              </div>

              <Separator /> */}

              {/* 数据同步设置 */}
              {/* <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">同步间隔 (分钟)</Label>
                  <p className="text-sm text-muted-foreground">
                    设置数据同步的频率
                  </p>
                </div>
                <Input
                  type="number"
                  value={system.syncInterval}
                  onChange={(e) => {
                    const interval = parseInt(e.target.value)
                    if (!isNaN(interval) && interval > 0) {
                      updateSystem({ syncInterval: interval })
                    }
                  }}
                  className="w-20 h-8 text-xs"
                  min="1"
                />
              </div>

              <Separator /> */}

              {/* 语言设置 */}
              <LabelSelect
                label={t.other.languageLabel}
                description={t.other.languageDescription}
                layout="complex"
                value={language}
                onChange={(value) => {
                  // 同时更新useTranslation钩子和本地状态
                  setLanguage(value as Language)
                  updateSetting('languageSettings', { language: value as 'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'fr' | 'de' | 'ru' | 'it' | 'es' | 'pt' | 'ar' })
                }}
                options={[
                  { value: 'zh-CN', label: t.other.languages['zh-CN'] },
                  { value: 'zh-TW', label: t.other.languages['zh-TW'] },
                  { value: 'en', label: t.other.languages['en'] },
                  { value: 'ja', label: t.other.languages['ja'] },
                  { value: 'ko', label: t.other.languages['ko'] },
                  { value: 'fr', label: t.other.languages['fr'] },
                  { value: 'de', label: t.other.languages['de'] },
                  { value: 'ru', label: t.other.languages['ru'] },
                  { value: 'it', label: t.other.languages['it'] },
                  { value: 'es', label: t.other.languages['es'] },
                  { value: 'pt', label: t.other.languages['pt'] },
                  { value: 'ar', label: t.other.languages['ar'] }
                ]}
              />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
