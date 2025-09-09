import React from 'react';
import { createRoot } from 'react-dom/client';
import FloatingPreview from './FloatingPreview';
import tailwindCss from '@/assets/tailwind.css?inline';
import { LinkPreviewSettings, ThemeSettings } from '@/types/settings';
import { FloatingPreviewSettings as FloatingPreviewSettingsType } from '@/types/floating-preview';

interface FloatingPreviewSettings extends LinkPreviewSettings {
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
    let settings: FloatingPreviewSettings | null = null;
    
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
      }
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
      
      // 构建FloatingPreview组件所需的settings对象
      const floatingPreviewSettings: FloatingPreviewSettingsType = {
        enabled: settings?.enabled || true,
        theme: settings?.theme || 'light',
        position: 'center',
        width: 800,
        height: 600,
        opacity: 1,
        dragToTrigger: settings?.triggerMethod === 'drag',
        showOnHover: settings?.triggerMethod === 'hover',
        hoverDelay: settings?.hoverDelay || 100,
        autoClose: false,
        autoCloseDelay: 3000
      };
      
      // 渲染FloatingPreview组件
      root.render(
        React.createElement(FloatingPreview, {
          url,
          settings: floatingPreviewSettings,
          mousePosition: { x, y }, // 传递鼠标位置
          onClose: closeFloatingPreview
        })
      );
      
      floatingPreview = { container, root };
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
    
    const init = async () => {
      await loadSettings();
      
      if (settings?.enabled) {
        document.addEventListener('dragstart', handleDragStart, true);
        document.addEventListener('dragend', handleDragEnd, true);
        
        if (settings.triggerMethod === 'hover') {
          document.addEventListener('mouseenter', handleMouseEnter, true);
        }
      }
    };
    
    const cleanup = () => {
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('dragend', handleDragEnd, true);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      
      closeFloatingPreview();
      
      const existingStyle = document.getElementById('floating-preview-tailwind-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
    
    browser.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && (changes.linkPreviewSettings || changes.themeSettings)) {
        loadSettings();
      }
    });
    
    init();
    window.addEventListener('beforeunload', cleanup);
  },
});
