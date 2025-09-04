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
    triggerMethod: 'drag', // 拖动链接、鼠标悬停、Alt+鼠标左键点击
    customShortcut: 'Alt',
    hoverDelay: 100, // 100ms - 2000ms
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

          <TabsContent value="linkPreview" className="space-y-6 p-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">{t.linkPreview.enableLabel}</Label>
                <Select
                  value={linkPreviewSettings.triggerMethod}
                  onValueChange={(value) => setLinkPreviewSettings(prev => ({ ...prev, triggerMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drag">{t.linkPreview.triggerMethods.drag}</SelectItem>
                  <SelectItem value="hover">{t.linkPreview.triggerMethods.hover}</SelectItem>
                  <SelectItem value="click">{t.linkPreview.triggerMethods.altClick}</SelectItem>
                </SelectContent>
                </Select>
              </div>

              {linkPreviewSettings.triggerMethod === 'click' && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">自定义快捷键</Label>
                  <Select
                    value={linkPreviewSettings.customShortcut}
                    onValueChange={(value) => setLinkPreviewSettings(prev => ({ ...prev, customShortcut: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alt">{t.linkPreview.shortcutKeys.alt}</SelectItem>
                      <SelectItem value="Ctrl">{t.linkPreview.shortcutKeys.ctrl}</SelectItem>
                      <SelectItem value="Shift">{t.linkPreview.shortcutKeys.shift}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {linkPreviewSettings.triggerMethod === 'hover' && (
                <div className="space-y-3">
                  <Label className="text-base font-medium">{t.linkPreview.delayLabel}: {linkPreviewSettings.hoverDelay}ms</Label>
                  <Slider
                    value={[linkPreviewSettings.hoverDelay]}
                    onValueChange={([value]) => setLinkPreviewSettings(prev => ({ ...prev, hoverDelay: value }))}
                    min={100}
                    max={10000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>100ms</span>
                    <span>10000ms</span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-base font-medium">{t.linkPreview.sizeLabel}</Label>
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

              <div className="space-y-3">
                <Label className="text-base font-medium">{t.linkPreview.positionLabel}</Label>
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

              <div className="space-y-3">
                <Label className="text-base font-medium">{t.linkPreview.themeLabel}</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['light', 'dark', 'blue', 'red', 'yellow', 'green'].map(theme => (
                    <div
                      key={theme}
                      className={`flex flex-col items-center cursor-pointer p-2 rounded-lg border-2 transition-all hover:shadow-md ${
                        linkPreviewSettings.popupTheme === theme 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setLinkPreviewSettings(prev => ({ ...prev, popupTheme: theme }))}
                    >
                      <div 
                        className={`w-8 h-8 rounded-full mb-2 border ${
                          theme === 'light' ? 'bg-white border-gray-300' :
                          theme === 'dark' ? 'bg-gray-800 border-gray-600' :
                          theme === 'blue' ? 'bg-blue-500 border-blue-600' :
                          theme === 'red' ? 'bg-red-500 border-red-600' :
                          theme === 'yellow' ? 'bg-yellow-400 border-yellow-500' :
                          'bg-green-500 border-green-600'
                        }`}
                      ></div>
                      <span className="text-xs text-center font-medium text-gray-700">
                        {t.linkPreview.themes[theme as keyof typeof t.linkPreview.themes]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">{t.linkPreview.opacityLabel}: {linkPreviewSettings.backgroundOpacity}%</Label>
                <Slider
                  value={[linkPreviewSettings.backgroundOpacity]}
                  onValueChange={([value]) => setLinkPreviewSettings(prev => ({ ...prev, backgroundOpacity: value }))}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dragText" className="space-y-6 p-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">{t.dragText.searchEngineLabel}</Label>
                <Select
                  value={dragTextSettings.searchEngine}
                  onValueChange={(value) => setDragTextSettings(prev => ({ ...prev, searchEngine: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bing">{t.dragText.searchEngines.bing}</SelectItem>
                    <SelectItem value="google">{t.dragText.searchEngines.google}</SelectItem>
                    <SelectItem value="baidu">{t.dragText.searchEngines.baidu}</SelectItem>
                    <SelectItem value="duckduckgo">{t.dragText.searchEngines.duckduckgo}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">{t.dragText.enableLabel}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t.dragText.enableDescription}
                  </p>
                </div>
                <Switch
                  checked={dragTextSettings.autoOpenLink}
                  onCheckedChange={(checked) => setDragTextSettings(prev => ({ ...prev, autoOpenLink: checked }))}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">{t.dragText.customTextLabel}</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  {t.dragText.customTextDescription}
                </p>
                <Textarea
                  value={dragTextSettings.disabledSites}
                  onChange={(e) => setDragTextSettings(prev => ({ ...prev, disabledSites: e.target.value }))}
                  placeholder={t.dragText.customTextPlaceholder}
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="other" className="space-y-6 p-6">
            <div className="space-y-6">
              {/* 主题设置 */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">{t.other.themeLabel}</Label>
                  <p className="text-sm text-muted-foreground mt-1">
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
              <div className="space-y-3">
                <Label className="text-base font-medium">{t.other.languageLabel}</Label>
                <Select
                  value={language}
                  onValueChange={setLanguage}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh-CN">{t.other.languages['zh-CN']}</SelectItem>
                    <SelectItem value="en">{t.other.languages['en']}</SelectItem>
                    <SelectItem value="ja">{t.other.languages['ja']}</SelectItem>
                    <SelectItem value="ko">{t.other.languages['ko']}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {t.other.languageDescription}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
