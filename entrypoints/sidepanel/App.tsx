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
import { useSettings } from '@/hooks/use-settings'
import { useTheme } from '@/hooks/use-theme'
import { useTranslation } from '@/hooks/use-i18n'
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
  
  // 确保默认显示链接预览设置Tab
  React.useEffect(() => {
    if (!ui.activeTab || !['linkPreview', 'dragText', 'other'].includes(ui.activeTab)) {
      updateUI({ activeTab: 'linkPreview' })
    }
  }, [ui.activeTab, updateUI])
  const { resolvedTheme, setTheme } = useTheme({
    theme: appearance.theme,
    onThemeChange: (theme) => updateAppearance({ theme })
  })

  // HoverTabOfLink 设置状态
  const [linkPreviewSettings, setLinkPreviewSettings] = React.useState({
    triggerMethod: 'drag', // 拖动链接、鼠标悬停、长按链接、Alt+鼠标左键点击
    customShortcut: 'Alt',
    hoverDelay: 100, // 100ms - 2000ms
    longPressDelay: 500, // 200ms - 3000ms
    popupSize: 'lastSize', // 上次大小、默认大小、内容自适应
    popupPosition: 'followMouse', // 跟随鼠标、屏幕居中、屏幕右上角
    popupTheme: 'green', // 浅色、深色、蓝色、红色、黄色、绿色
    backgroundOpacity: 50 // 0% - 100%
  })

  const [dragTextSettings, setDragTextSettings] = React.useState({
    searchEngine: 'bing', // 必应搜索
    autoOpenLink: false, // 是/否
    disabledSites: '' // 禁用网站列表
  })

  // 域名验证状态
  const [domainValidation, setDomainValidation] = React.useState({
    hasError: false,
    errorMessage: '',
    exceedsLimit: false
  })

  // 域名格式验证函数
  const validateDomain = (domain: string): boolean => {
    // 支持一级域名和二级域名格式
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+(com|net|org|edu|gov|mil|int|co|io|me|tv|info|biz|name|mobi|pro|travel|museum|aero|jobs|cat|tel|post|xxx|[a-z]{2})$/i
    const simpleDomainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.([a-zA-Z]{2,})$/
    return domainRegex.test(domain) || simpleDomainRegex.test(domain)
  }

  // 验证所有域名
  const validateAllDomains = (domainsText: string) => {
    const lines = domainsText.split('\n').filter(line => line.trim())
    const invalidDomains: string[] = []
    
    lines.forEach(line => {
      const domain = line.trim()
      if (domain && !validateDomain(domain)) {
        invalidDomains.push(domain)
      }
    })

    const exceedsLimit = lines.length > 10
    const hasError = invalidDomains.length > 0

    setDomainValidation({
      hasError,
      errorMessage: hasError ? `${t.dragText.invalidDomains}: ${invalidDomains.join(', ')}` : '',
      exceedsLimit
    })

    return !hasError && !exceedsLimit
  }

  // Language settings now managed by useTranslation hook

  // 主题选项配置（参考根目录App.tsx的实现）
  const themeOptions = [
    { value: 'system', label: t.other.themes.system, icon: Monitor },
    { value: 'light', label: t.other.themes.light, icon: Sun },
    { value: 'dark', label: t.other.themes.dark, icon: Moon }
  ] as const

  const handleTabChange = (value: string) => {
    updateUI({ activeTab: value })
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
    <div className="flex flex-col h-screen bg-background">
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
        <Tabs value={ui.activeTab} onValueChange={handleTabChange} className="w-full h-full flex flex-col">
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
                value={linkPreviewSettings.triggerMethod}
                onChange={(value) => setLinkPreviewSettings(prev => ({ ...prev, triggerMethod: value }))}
                options={[
                  { value: 'drag', label: t.linkPreview.triggerMethods.drag },
                  { value: 'hover', label: t.linkPreview.triggerMethods.hover },
                  { value: 'longPress', label: t.linkPreview.triggerMethods.longPress },
                  { 
                    value: 'click', 
                    label: `${t.linkPreview.shortcutKeys[linkPreviewSettings.customShortcut?.toLowerCase() as keyof typeof t.linkPreview.shortcutKeys] || t.linkPreview.shortcutKeys.alt}+${t.linkPreview.clickText}`
                  },
                  { 
                    value: 'customHover', 
                    label: `${t.linkPreview.shortcutKeys[linkPreviewSettings.customShortcut?.toLowerCase() as keyof typeof t.linkPreview.shortcutKeys] || t.linkPreview.shortcutKeys.alt}+${t.linkPreview.hoverText}`
                  },
                  { value: 'disabled', label: t.linkPreview.triggerMethods.disabled }
                ]}
              />

              {(linkPreviewSettings.triggerMethod === 'click' || linkPreviewSettings.triggerMethod === 'customHover') && (
                <LabelSelect
                  label={t.linkPreview.shortcutKeyLabel}
                  value={linkPreviewSettings.customShortcut}
                  onChange={(value) => setLinkPreviewSettings(prev => ({ ...prev, customShortcut: value }))}
                  options={[
                    { value: 'Alt', label: t.linkPreview.shortcutKeys.alt },
                    { value: 'Ctrl', label: t.linkPreview.shortcutKeys.ctrl },
                    { value: 'Shift', label: t.linkPreview.shortcutKeys.shift }
                  ]}
                />
              )}

              {linkPreviewSettings.triggerMethod === 'hover' && (
                <DelaySlider
                  label={t.linkPreview.delayLabel}
                  value={linkPreviewSettings.hoverDelay}
                  onChange={(value) => setLinkPreviewSettings(prev => ({ ...prev, hoverDelay: value }))}
                  min={100}
                  max={3000}
                  step={50}
                  unit="ms"
                />
              )}

              {linkPreviewSettings.triggerMethod === 'longPress' && (
                <DelaySlider
                  label={t.linkPreview.longPressDelayLabel}
                  value={linkPreviewSettings.longPressDelay}
                  onChange={(value) => setLinkPreviewSettings(prev => ({ ...prev, longPressDelay: value }))}
                  min={200}
                  max={3000}
                  step={50}
                  unit="ms"
                />
              )}

              {linkPreviewSettings.triggerMethod === 'customHover' && (
                <DelaySlider
                  label={t.linkPreview.delayLabel}
                  value={linkPreviewSettings.hoverDelay}
                  onChange={(value) => setLinkPreviewSettings(prev => ({ ...prev, hoverDelay: value }))}
                  min={100}
                  max={3000}
                  step={50}
                  unit="ms"
                />
              )}

              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold text-foreground">{t.linkPreview.sizeLabel}</Label>
                <Select
                  value={linkPreviewSettings.popupSize}
                  onValueChange={(value) => setLinkPreviewSettings(prev => ({ ...prev, popupSize: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lastSize">{t.linkPreview.popupSizes.lastSize}</SelectItem>
                    <SelectItem value="default">{t.linkPreview.popupSizes.defaultSize}</SelectItem>
                    <SelectItem value="adaptive">{t.linkPreview.popupSizes.contentAdaptive}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold text-foreground">{t.linkPreview.positionLabel}</Label>
                <Select
                  value={linkPreviewSettings.popupPosition}
                  onValueChange={(value) => setLinkPreviewSettings(prev => ({ ...prev, popupPosition: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="followMouse">{t.linkPreview.popupPositions.followMouse}</SelectItem>
                    <SelectItem value="center">{t.linkPreview.popupPositions.center}</SelectItem>
                    <SelectItem value="topRight">{t.linkPreview.popupPositions.topRight}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold text-foreground">{t.linkPreview.themeLabel}</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['light', 'dark', 'blue', 'red', 'yellow', 'green'].map(theme => (
                    <div
                      key={theme}
                      className={`flex flex-col items-center cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                        linkPreviewSettings.popupTheme === theme 
                          ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20' 
                          : 'border-border hover:border-muted-foreground/30 bg-card hover:bg-accent/50'
                      }`}
                      onClick={() => setLinkPreviewSettings(prev => ({ ...prev, popupTheme: theme }))}
                    >
                      <div 
                        className={`w-10 h-10 rounded-full mb-2.5 border-2 shadow-sm ${
                          theme === 'light' ? 'bg-white border-gray-300 shadow-inner' :
                          theme === 'dark' ? 'bg-gray-900 border-gray-700' :
                          theme === 'blue' ? 'bg-blue-500 border-blue-600 shadow-blue-200/50' :
                          theme === 'red' ? 'bg-red-500 border-red-600 shadow-red-200/50' :
                          theme === 'yellow' ? 'bg-yellow-400 border-yellow-500 shadow-yellow-200/50' :
                          'bg-green-500 border-green-600 shadow-green-200/50'
                        }`}
                      ></div>
                      <span className="text-xs text-center font-medium text-foreground/90 leading-tight">
                        {t.linkPreview.themes[theme as keyof typeof t.linkPreview.themes]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <DelaySlider
                label={t.linkPreview.opacityLabel}
                value={linkPreviewSettings.backgroundOpacity}
                onChange={(value) => setLinkPreviewSettings(prev => ({ ...prev, backgroundOpacity: value }))}
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
                checked={dragTextSettings.autoOpenLink}
                onCheckedChange={(checked) => setDragTextSettings(prev => ({ ...prev, autoOpenLink: checked }))}
              />
            </div>

            <div className="space-y-6">
              <LabelSelect
                label={t.dragText.searchEngineLabel}
                value={dragTextSettings.searchEngine}
                onChange={(value) => setDragTextSettings(prev => ({ ...prev, searchEngine: value }))}
                disabled={!dragTextSettings.autoOpenLink}
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
                    value={dragTextSettings.disabledSites}
                    onChange={(e) => {
                      const value = e.target.value
                      setDragTextSettings(prev => ({ ...prev, disabledSites: value }))
                      
                      // 实时验证域名
                      if (value.trim()) {
                        validateAllDomains(value)
                      } else {
                        setDomainValidation({ hasError: false, errorMessage: '', exceedsLimit: false })
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
                  {dragTextSettings.disabledSites.trim() && (
                    <p className={`text-xs ${
                      domainValidation.exceedsLimit ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                      {t.dragText.domainCountHint.replace('{count}', 
                        dragTextSettings.disabledSites.split('\n').filter(line => line.trim()).length.toString()
                      )}
                    </p>
                  )}
                  
                  {/* 错误提示 */}
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
                        onClick={() => setTheme(option.value)}
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
                onChange={(value) => setLanguage(value as Language)}
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
