import React from "react";
import { useAppConfig } from "#imports";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/hooks/use-i18n";
import { useSettingsManager } from "@/hooks/use-settings-manager";
import { Language } from "@/lib/i18n";
import { getAvailableModifierKeys } from "@/lib/utils";
import { DelaySlider } from "./components/DelaySlider";
import { LabelSelect } from "./components/LabelSelect";
import {
  Heart,
  Link,
  MousePointer,
  Monitor,
  Moon,
  Sun,
  Settings,
  RotateCcw,
} from "lucide-react";
import { Toaster, toast } from "sonner";

function App() {
  const config = useAppConfig();
  // 已废弃旧的useSettings hook，改用新的useSettingsManager
  const { t, language, setLanguage, isLoading: i18nLoading } = useTranslation();

  // 使用新的设置管理Hook
  const {
    settings,
    isLoading: settingsLoading,
    isInitialized,
    domainValidation,
    updateSetting,
    updateSettings,
    resetSettings: resetAllSettings,
    validateDomains,
    waitForNextSave,
  } = useSettingsManager();

  // 检查当前修饰键是否在当前平台可用，如果不可用则自动切换
  React.useEffect(() => {
    if (isInitialized) {
      const availableKeys = getAvailableModifierKeys();
      const currentKey = settings.linkPreviewSettings.customShortcut;

      if (!availableKeys.includes(currentKey)) {
        // 当前修饰键在此平台不可用，切换到第一个可用选项
        updateSetting("linkPreviewSettings", {
          customShortcut: availableKeys[0],
        });
      }
    }
  }, [
    isInitialized,
    settings.linkPreviewSettings.customShortcut,
    updateSetting,
  ]);

  // 确保默认显示链接预览设置Tab
  React.useEffect(() => {
    if (
      !settings.uiSettings.activeTab ||
      !["linkPreview", "dragText", "other"].includes(
        settings.uiSettings.activeTab
      )
    ) {
      updateSetting("uiSettings", { activeTab: "linkPreview" });
    }
  }, [settings.uiSettings.activeTab, updateSetting]);

  const { resolvedTheme, setTheme } = useTheme({
    theme: settings.themeSettings.theme,
    onThemeChange: (theme) => {
      const p = waitForNextSave();
      updateSetting("themeSettings", { theme });
      p.then((ok) => {
        if (ok) showSuccessToast(t.other.settingsSaved);
      });
    },
  });

  // 同步语言设置
  React.useEffect(() => {
    if (isInitialized && settings.languageSettings.language !== language) {
      setLanguage(settings.languageSettings.language as Language);
    }
  }, [
    settings.languageSettings.language,
    language,
    setLanguage,
    isInitialized,
  ]);

  // 域名验证逻辑现在由 useSettingsManager Hook 处理

  // Language settings now managed by useTranslation hook

  // 主题选项配置（参考根目录App.tsx的实现）
  const themeOptions = [
    { value: "system", label: t.other.themes.system, icon: Monitor },
    { value: "light", label: t.other.themes.light, icon: Sun },
    { value: "dark", label: t.other.themes.dark, icon: Moon },
  ] as const;

  const handleTabChange = (value: string) => {
      updateSetting("uiSettings", {
        activeTab: value as "linkPreview" | "dragText" | "other",
      })
  };

  // 显示设置保存成功提示
  const showSuccessToast = (message: string) => {
    // 使用统一配置的 sonner toast
    toast(message);
  };

  // 统一的更新并在保存成功后提示的方法
  const updateAndToast = React.useCallback(
    (doUpdate: () => void) => {
      const p = waitForNextSave();
      doUpdate();
      p.then((ok) => {
        if (ok) showSuccessToast(t.other.settingsSaved);
      });
    },
    [waitForNextSave, t.other.settingsSaved]
  );

  if (settingsLoading || i18nLoading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background min-w-[360px]">
      {/* Header */}
      <div className="border-none px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <img src="/icon/128.png" alt="Logo" className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">HoverTabOfLink</h1>
            <p className="text-sm text-muted-foreground">{t.appDescription}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden border-none">
        <Tabs
          value={settings.uiSettings.activeTab}
          onValueChange={handleTabChange}
          className="w-full h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <TabsTrigger
                    value="linkPreview"
                    className="flex items-center justify-center p-3 w-full"
                  >
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
                  <TabsTrigger
                    value="dragText"
                    className="flex items-center justify-center p-3 w-full"
                  >
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
                  <TabsTrigger
                    value="other"
                    className="flex items-center justify-center p-3 w-full"
                  >
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
                  onChange={(value) => {
                    updateAndToast(() =>
                      updateSetting("linkPreviewSettings", {
                        triggerMethod: value as
                          | "drag"
                          | "hover"
                          | "longPress"
                          | "click"
                          | "customHover"
                          | "disabled",
                      })
                    );
                  }}
                  options={[
                    { value: "drag", label: t.linkPreview.triggerMethods.drag },
                    {
                      value: "hover",
                      label: t.linkPreview.triggerMethods.hover,
                    },
                    {
                      value: "longPress",
                      label: t.linkPreview.triggerMethods.longPress,
                    },
                    {
                      value: "click",
                      label: `${
                        t.linkPreview.shortcutKeys[
                          settings.linkPreviewSettings.customShortcut?.toLowerCase() as keyof typeof t.linkPreview.shortcutKeys
                        ] || t.linkPreview.shortcutKeys.alt
                      }+${t.linkPreview.clickText}`,
                    },
                    {
                      value: "customHover",
                      label: `${
                        t.linkPreview.shortcutKeys[
                          settings.linkPreviewSettings.customShortcut?.toLowerCase() as keyof typeof t.linkPreview.shortcutKeys
                        ] || t.linkPreview.shortcutKeys.alt
                      }+${t.linkPreview.hoverText}`,
                    },
                    {
                      value: "disabled",
                      label: t.linkPreview.triggerMethods.disabled,
                    },
                  ]}
                />

                {(settings.linkPreviewSettings.triggerMethod === "click" ||
                  settings.linkPreviewSettings.triggerMethod ===
                    "customHover") && (
                  <LabelSelect
                    label={t.linkPreview.shortcutKeyLabel}
                    value={settings.linkPreviewSettings.customShortcut}
                    onChange={(value) => {
                      updateAndToast(() =>
                        updateSetting("linkPreviewSettings", {
                          customShortcut: value as "Alt" | "Cmd" | "Shift",
                        })
                      );
                    }}
                    options={getAvailableModifierKeys().map((key) => ({
                      value: key,
                      label:
                        t.linkPreview.shortcutKeys[
                          key.toLowerCase() as keyof typeof t.linkPreview.shortcutKeys
                        ],
                    }))}
                  />
                )}

                {settings.linkPreviewSettings.triggerMethod === "hover" && (
                  <DelaySlider
                    label={t.linkPreview.delayLabel}
                    value={settings.linkPreviewSettings.hoverDelay / 1000}
                    onChange={(value) => {
                      updateAndToast(() =>
                        updateSetting("linkPreviewSettings", {
                          hoverDelay: value * 1000,
                        })
                      );
                    }}
                    min={0.1}
                    max={2}
                    step={0.05}
                    unit="s"
                  />
                )}

                {settings.linkPreviewSettings.triggerMethod === "longPress" && (
                  <DelaySlider
                    label={t.linkPreview.longPressDelayLabel}
                    value={settings.linkPreviewSettings.longPressDelay / 1000}
                    onChange={(value) => {
                      updateAndToast(() =>
                        updateSetting("linkPreviewSettings", {
                          longPressDelay: value * 1000,
                        })
                      );
                    }}
                    min={0.2}
                    max={3}
                    step={0.1}
                    unit="s"
                  />
                )}

                {settings.linkPreviewSettings.triggerMethod ===
                  "customHover" && (
                  <DelaySlider
                    label={t.linkPreview.delayLabel}
                    value={settings.linkPreviewSettings.hoverDelay / 1000}
                    onChange={(value) => {
                      updateAndToast(() =>
                        updateSetting("linkPreviewSettings", {
                          hoverDelay: value * 1000,
                        })
                      );
                    }}
                    min={0.1}
                    max={2}
                    step={0.05}
                    unit="s"
                  />
                )}

                <LabelSelect
                  label={t.linkPreview.sizeLabel}
                  value={settings.linkPreviewSettings.popupSize}
                  onChange={(value) => {
                    updateAndToast(() =>
                      updateSetting("linkPreviewSettings", {
                        popupSize: value as "last" | "small" | "medium" | "large",
                      })
                    );
                  }}
                  options={[
                    {
                      value: "last",
                      label: t.linkPreview.popupSizes.last,
                    },
                    {
                      value: "small",
                      label: t.linkPreview.popupSizes.small,
                    },
                    {
                      value: "medium",
                      label: t.linkPreview.popupSizes.medium,
                    },
                    {
                      value: "large",
                      label: t.linkPreview.popupSizes.large,
                    },
                  ]}
                />

                <LabelSelect
                  label={t.linkPreview.positionLabel}
                  value={settings.linkPreviewSettings.popupPosition}
                  onChange={(value) => {
                    updateAndToast(() =>
                      updateSetting("linkPreviewSettings", {
                        popupPosition: value as "last" | "center" | "left" | "right",
                      })
                    );
                  }}
                  options={[
                    {
                      value: "last",
                      label: t.linkPreview.popupPositions.last,
                    },
                    {
                      value: "center",
                      label: t.linkPreview.popupPositions.center,
                    },
                    {
                      value: "left",
                      label: t.linkPreview.popupPositions.left,
                    },
                    {
                      value: "right",
                      label: t.linkPreview.popupPositions.right,
                    },
                  ]}
                />

                <DelaySlider
                  label={t.linkPreview.opacityLabel}
                  value={settings.linkPreviewSettings.backgroundOpacity}
                  onChange={(value) => {
                    updateAndToast(() =>
                      updateSetting("linkPreviewSettings", {
                        backgroundOpacity: value,
                      })
                    );
                  }}
                  min={0}
                  max={100}
                  step={5}
                  unit="%"
                />

                <LabelSelect
                  label={t.linkPreview.maxWindowsLabel}
                  description={t.linkPreview.maxWindowsDescription}
                  value={settings.linkPreviewSettings.maxFloatingWindows}
                  onChange={(value) => {
                    const numValue = Number(value);
                    updateAndToast(() =>
                      updateSetting("linkPreviewSettings", {
                        maxFloatingWindows: numValue,
                      })
                    );
                  }}
                  options={[
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '5', label: '5' },
                    { value: '6', label: '6' },
                  ]}
                  layout="complex"
                />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold text-foreground">
                      {t.linkPreview.autoPinLabel}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t.linkPreview.autoPinDescription}
                    </p>
                  </div>
                  <Switch
                    checked={settings.linkPreviewSettings.autoPin}
                    onCheckedChange={(checked) => {
                      updateAndToast(() => updateSetting("linkPreviewSettings", { autoPin: checked }));
                    }}
                  />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="dragText" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold text-foreground">
                    {t.dragText.enableLabel}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t.dragText.enableDescription}
                  </p>
                </div>
                <Switch
                  checked={settings.dragTextSettings.enabled}
                  onCheckedChange={(checked) => {
                    updateAndToast(() => {
                      updateSetting("dragTextSettings", { enabled: checked });
                    });
                  }}
                />
              </div>

              <div className="space-y-6">
                <LabelSelect
                  label={t.dragText.searchEngineLabel}
                  description={t.dragText.newTabHint}
                  layout="complex"
                  value={settings.dragTextSettings.searchEngine}
                  onChange={(value) => {
                    updateAndToast(() => {
                      updateSetting("dragTextSettings", {
                        searchEngine: value as
                          | "bing"
                          | "google"
                          | "baidu"
                          | "duckduckgo"
                          | "perplexity",
                      });
                    });
                  }}
                  disabled={!settings.dragTextSettings.enabled}
                  options={[
                    { value: "bing", label: t.dragText.searchEngines.bing },
                    { value: "google", label: t.dragText.searchEngines.google },
                    { value: "baidu", label: t.dragText.searchEngines.baidu },
                    {
                      value: "duckduckgo",
                      label: t.dragText.searchEngines.duckduckgo,
                    },
                    {
                      value: "perplexity",
                      label: t.dragText.searchEngines.perplexity,
                    },
                  ]}
                />

                <div className="space-y-3">
                  <Label className="text-base font-semibold text-foreground">
                    {t.dragText.disabledSitesLabel}
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t.dragText.disabledSitesDescription}
                  </p>
                  <div className="space-y-2">
                    <Textarea
                      disabled={!settings.dragTextSettings.enabled}
                      value={settings.dragTextSettings.disabledSites}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateAndToast(() =>
                          updateSetting("dragTextSettings", {
                            disabledSites: value,
                          })
                        );

                        // 实时验证域名
                        if (value.trim()) {
                          validateDomains(value);
                        } else {
                          // 输入框为空时清除验证状态
                          validateDomains("");
                        }
                      }}
                      placeholder={t.dragText.disabledSitesPlaceholder}
                      className={`min-h-[120px] resize-none text-xs ${
                        domainValidation.hasError ||
                        domainValidation.exceedsLimit
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />

                    {/* 域名格式提示 */}
                    <p className="text-xs text-muted-foreground">
                      {t.dragText.domainFormatHint}
                    </p>

                    {/* 域名数量提示 */}
                    {settings.dragTextSettings.disabledSites.trim() && (
                      <p
                        className={`text-xs ${
                          domainValidation.exceedsLimit
                            ? "text-red-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {t.dragText.domainCountHint.replace(
                          "{count}",
                          settings.dragTextSettings.disabledSites
                            .split("\n")
                            .filter((line) => line.trim())
                            .length.toString()
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
                    <Label className="text-base font-semibold text-foreground">
                      {t.other.themeLabel}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.other.themeDescription}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {themeOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive =
                        settings.themeSettings.theme === option.value;
                      return (
                        <Button
                          key={option.value}
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            // 同时更新useTheme钩子和本地状态
                            setTheme(option.value);
                            updateSetting("themeSettings", {
                              theme: option.value,
                            });
                            // showSuccessToast已在useTheme的onThemeChange中调用，无需重复
                          }}
                          className="flex flex-col gap-1 h-auto py-3"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-xs">{option.label}</span>
                        </Button>
                      );
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
                    setLanguage(value as Language);
                    updateAndToast(() =>
                      updateSetting("languageSettings", {
                        language: value as
                          | "zh-CN"
                          | "zh-TW"
                          | "en"
                          | "ko"
                          | "fr"
                          | "de"
                          | "ru"
                          | "it"
                          | "es"
                          | "ja"
                          | "pt"
                          | "ar",
                      })
                    );
                  }}
                  options={[
                    { value: "zh-CN", label: t.other.languages["zh-CN"] },
                    { value: "zh-TW", label: t.other.languages["zh-TW"] },
                    { value: "en", label: t.other.languages["en"] },
                    { value: "ko", label: t.other.languages["ko"] },
                    { value: "fr", label: t.other.languages["fr"] },
                    { value: "de", label: t.other.languages["de"] },
                    { value: "ru", label: t.other.languages["ru"] },
                    { value: "it", label: t.other.languages["it"] },
                    { value: "es", label: t.other.languages["es"] },
                    { value: "ja", label: t.other.languages["ja"] },
                    { value: "pt", label: t.other.languages["pt"] },
                    { value: "ar", label: t.other.languages["ar"] },
                  ]}
                />

                <Separator />

                {/* 重置设置 */}
                <div className="space-y-4 flex justify-between">
                  <div>
                    <Label className="text-base font-semibold text-foreground">
                      {t.common.resetSettings}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.common.resetSettingsDescription}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        resetAllSettings();
                        toast(t.common.resetSuccess);
                      } catch (error) {
                        console.error('重置设置失败:', error);
                        toast(t.common.resetFailed);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {t.common.reset}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Toast 通知组件 */}
      <Toaster 
        position="bottom-center"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        toastOptions={{
          style:{background: 'var(--primary)', color: 'var(--background)',
            minHeight: '48px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            fontWeight: '1500',
            fontSize: '14px',
            maxWidth:'200px',
}
        }}
      /> 
      {/* <Toaster 
        position="bottom-center"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        richColors
        expand={false}
        visibleToasts={2}
        closeButton={false}
        toastOptions={{
          duration: 2000,
          style: {
            zIndex: 2147483647,
            minHeight: '48px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid var(--border)',
            background: 'var(--background)',
            color: 'var(--foreground)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
          },
          className: 'toast-custom',
        }}
      /> */}
    </div>
  );
}

export default App;
