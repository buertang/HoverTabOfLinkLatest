import React from 'react';
import { createRoot } from 'react-dom/client';
import FloatingPreview from './FloatingPreview';
import tailwindCss from '@/assets/tailwind.css?inline';
import { LinkPreviewSettings, ThemeSettings } from '@/types/settings';
import { FloatingPreviewSettings as FloatingPreviewSettingsType } from '@/types/floating-preview';

// 将本地运行时设置命名为 ResolvedLinkPreviewSettings，避免与全局类型名混淆
interface ResolvedLinkPreviewSettings extends LinkPreviewSettings {
  enabled: boolean;
  theme: 'light' | 'dark';
}

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    const injectTailwindCSS = () => {
      if (document.getElementById('floating-preview-tailwind-styles')) {
        return;
      }
      
      const styleElement = document.createElement('style');
      styleElement.id = 'floating-preview-tailwind-styles';
      styleElement.textContent = tailwindCss;
      document.head.appendChild(styleElement);
    };
    
    injectTailwindCSS();
    
    let isDragging = false;
    let draggedLink: HTMLAnchorElement | null = null;
    let floatingPreview: { container: HTMLElement; root: any } | null = null;
    let settings: ResolvedLinkPreviewSettings | null = null;
    // 记录用户在侧边栏选择的主题模式（light/dark/system），用于判断是否需要跟随系统
    let themeMode: 'system' | 'light' | 'dark' = 'system';
    // 系统主题监听器（仅当 themeMode === 'system' 时生效）
    let systemMediaQuery: MediaQueryList | null = null;
    // 保存最近一次打开的预览信息，便于在主题变更时重新渲染
    let lastPreviewUrl: string | null = null;
    let lastMousePos: { x: number; y: number } | null = null;
    
    const getSystemTheme = (): 'light' | 'dark' => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const determineTheme = (globalTheme: 'system' | 'light' | 'dark'): 'light' | 'dark' => {
      return globalTheme === 'system' ? getSystemTheme() : globalTheme;
    };

    const loadSettings = async () => {
      try {
        const result = await browser.storage.local.get(['linkPreviewSettings', 'themeSettings']);
        
        const linkPreviewSettings: LinkPreviewSettings = result.linkPreviewSettings || {
          triggerMethod: 'drag',
          customShortcut: 'Alt',
          hoverDelay: 100,
          longPressDelay: 500,
          popupSize: 'default',
          popupPosition: 'followMouse',
          backgroundOpacity: 50
        };
        
        const themeSettings: ThemeSettings = result.themeSettings || { theme: 'system' };
        // 记录原始主题模式（是否为 system）
        themeMode = themeSettings.theme;
        const resolvedTheme = determineTheme(themeSettings.theme);
        
        settings = {
          ...linkPreviewSettings,
          enabled: linkPreviewSettings.triggerMethod !== 'disabled',
          theme: resolvedTheme
        };
      } catch (error) {
        settings = {
          triggerMethod: 'drag',
          customShortcut: 'Alt',
          hoverDelay: 100,
          longPressDelay: 500,
          popupSize: 'default',
          popupPosition: 'followMouse',
          backgroundOpacity: 50,
          enabled: true,
          theme: getSystemTheme()
        };
        themeMode = 'system';
      }
    };
    
    // 统一渲染函数：用于首次创建和主题变更时的重新渲染
    const renderFloatingPreview = (url: string, x: number, y: number) => {
      if (!settings) return;
      const floatingPreviewSettings: FloatingPreviewSettingsType = {
        enabled: settings.enabled || true,
        theme: settings.theme || 'light',
        position: 'center',
        width: 800,
        height: 600,
        opacity: 1,
        backgroundOpacity: settings.backgroundOpacity || 80, // 传递背景遮罩透明度
        dragToTrigger: settings.triggerMethod === 'drag',
        showOnHover: settings.triggerMethod === 'hover',
        hoverDelay: settings.hoverDelay || 100,
        autoClose: false,
        autoCloseDelay: 3000
      };
      
      const element = React.createElement(FloatingPreview, {
        url,
        settings: floatingPreviewSettings,
        mousePosition: { x, y },
        onClose: closeFloatingPreview
      });
      
      // 若已存在 root，则复用 root 进行重新渲染，从而更新主题而不丢失内部状态
      if (floatingPreview) {
        floatingPreview.root.render(element);
      }
      return element;
    };


    // 创建悬浮预览窗口 - 使用新的FloatingPreview组件
    const createFloatingPreview = (url: string, x: number, y: number) => {
      if (floatingPreview) {
        closeFloatingPreview();
      }
      
      // 创建容器元素
      const container = document.createElement('div');
      container.id = 'floating-preview-container';
      document.body.appendChild(container);
      
      // 创建React根节点
      const root = createRoot(container);
      
      // 记录最近一次的预览参数
      lastPreviewUrl = url;
      lastMousePos = { x, y };
      
      // 首次渲染
      const element = renderFloatingPreview(url, x, y);
      if (element) {
        root.render(element);
      }
      
      floatingPreview = { container, root };
    };
    
    // 主题或设置变更后，尝试在不销毁的情况下更新现有预览
    const rerenderFloatingPreview = () => {
      if (!floatingPreview || !settings || !lastPreviewUrl || !lastMousePos) return;
      renderFloatingPreview(lastPreviewUrl, lastMousePos.x, lastMousePos.y);
    };
    
    const closeFloatingPreview = () => {
      if (floatingPreview) {
        floatingPreview.root.unmount();
        document.body.removeChild(floatingPreview.container);
        floatingPreview = null;
      }
    };
    
    const handleDragStart = (event: DragEvent) => {
      const target = event.target as HTMLElement;
      
      if (target.tagName === 'A' && target instanceof HTMLAnchorElement) {
        isDragging = true;
        draggedLink = target;
      }
    };
    
    const handleDragEnd = (event: DragEvent) => {
      if (isDragging && draggedLink && settings?.triggerMethod === 'drag') {
        const url = draggedLink.href;
        
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
          createFloatingPreview(url, event.clientX, event.clientY);
        }
      }
      
      isDragging = false;
      draggedLink = null;
    };
    
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (settings?.triggerMethod === 'hover' && target.tagName === 'A' && target instanceof HTMLAnchorElement) {
        const url = target.href;
        
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
          setTimeout(() => {
            if (!floatingPreview) {
              createFloatingPreview(url, event.clientX, event.clientY);
            }
          }, settings.hoverDelay);
        }
      }
    };
    
    // 监听系统主题变化（仅当主题模式为 system 时生效）
    const setupSystemThemeListener = () => {
      try {
        systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
          if (themeMode === 'system') {
            const newTheme = getSystemTheme();
            if (settings && settings.theme !== newTheme) {
              settings = { ...(settings as ResolvedLinkPreviewSettings), theme: newTheme };
              rerenderFloatingPreview();
            }
          }
        };
        systemMediaQuery.addEventListener('change', handler);
        // 将移除函数挂到对象上，便于 cleanup
        (setupSystemThemeListener as any)._remove = () => {
          try { systemMediaQuery?.removeEventListener('change', handler); } catch {}
        };
      } catch {}
    };

    const init = async () => {
      await loadSettings();
      
      if (settings?.enabled) {
        document.addEventListener('dragstart', handleDragStart, true);
        document.addEventListener('dragend', handleDragEnd, true);
        
        if (settings.triggerMethod === 'hover') {
          document.addEventListener('mouseenter', handleMouseEnter, true);
        }
      }
      // 初始化系统主题监听
      setupSystemThemeListener();
    };
    
    const cleanup = () => {
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('dragend', handleDragEnd, true);
      document.removeEventListener('mouseenter', handleMouseEnter, true);

      // 移除 storage 监听
      if (handleStorageChange) {
        browser.storage.onChanged.removeListener(handleStorageChange);
      }
      // 取消系统主题监听
      if ((setupSystemThemeListener as any)._remove) {
        try { (setupSystemThemeListener as any)._remove(); } catch {}
      }
      
      closeFloatingPreview();
      
      const existingStyle = document.getElementById('floating-preview-tailwind-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
    
    // 具名的存储变更处理器，便于在 cleanup 时移除
    const handleStorageChange = async (changes: any, namespace: string) => {
      if (namespace === 'local' && (changes.linkPreviewSettings || changes.themeSettings)) {
        await loadSettings();
        // 若仅主题变化，直接触发重新渲染即可
        rerenderFloatingPreview();
      }
    };
    
    browser.storage.onChanged.addListener(handleStorageChange);
    
    init();
    // 通过返回 cleanup 让 WXT 在脚本卸载时自动清理，避免监听器泄漏
    return cleanup;
  },
});
