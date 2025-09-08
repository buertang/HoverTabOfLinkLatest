import React from 'react';
import { createRoot } from 'react-dom/client';
import FloatingPreview from '../components/FloatingPreview';

// 定义FloatingPreview设置接口
interface FloatingPreviewSettings {
  enabled: boolean;
  theme: 'light' | 'dark'; // 只支持浅色和深色主题
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  width: number;
  height: number;
  opacity: number;
  dragToTrigger: boolean;
  showOnHover: boolean;
  hoverDelay: number;
  autoClose: boolean;
  autoCloseDelay: number;
}

export default defineContentScript({
  matches: ['<all_urls>'], // 匹配所有网站
  main() {
    console.log('FloatingPreview content script loaded');
    
    let isDragging = false;
    let draggedLink: HTMLAnchorElement | null = null;
    let floatingPreviewRoot: any = null;
    let floatingPreviewContainer: HTMLDivElement | null = null;
    let settings: FloatingPreviewSettings | null = null;
    let currentMousePosition = { x: 0, y: 0 }; // 当前鼠标位置
    
    // 获取系统主题
    const getSystemTheme = (): 'light' | 'dark' => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // 根据全局主题设置确定弹窗主题
    const determineFloatingPreviewTheme = (globalTheme: 'system' | 'light' | 'dark'): 'light' | 'dark' => {
      if (globalTheme === 'system') {
        return getSystemTheme();
      }
      return globalTheme;
    };

    // 加载设置
    const loadSettings = async () => {
      try {
        // 同时加载弹窗设置和全局主题设置
        const result = await browser.storage.local.get(['floatingPreviewSettings', 'themeSettings']);
        
        // 获取全局主题设置
        const globalThemeSettings = result.themeSettings || { theme: 'system' };
        const floatingPreviewTheme = determineFloatingPreviewTheme(globalThemeSettings.theme);
        
        // 设置弹窗配置，主题与全局主题保持同步
        settings = result.floatingPreviewSettings || {
          enabled: true,
          theme: floatingPreviewTheme, // 根据全局主题确定
          position: 'center',
          width: 800,
          height: 600,
          opacity: 0.95,
          dragToTrigger: true,
          showOnHover: false,
          hoverDelay: 500,
          autoClose: true,
          autoCloseDelay: 5000
        };
        
        // 确保弹窗主题与全局主题同步
        if (settings) {
          settings.theme = floatingPreviewTheme;
        }
      } catch (error) {
        console.error('Failed to load FloatingPreview settings:', error);
        // 使用默认设置
        const defaultTheme = getSystemTheme();
        settings = {
          enabled: true,
          theme: defaultTheme, // 使用系统主题作为默认
          position: 'center',
          width: 800,
          height: 600,
          opacity: 0.95,
          dragToTrigger: true,
          showOnHover: false,
          hoverDelay: 500,
          autoClose: true,
          autoCloseDelay: 5000
        };
      }
    };
    
    // 获取页面主体内容区域的尺寸
    const getContentAreaSize = () => {
      // 获取视口尺寸
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // 计算合适的弹窗尺寸（占据视口的80%）
      const width = Math.min(Math.max(viewportWidth * 0.8, 600), 1200);
      const height = Math.min(Math.max(viewportHeight * 0.8, 400), 800);
      
      return { width, height };
    };

    // 节流函数，限制更新频率
    let mouseUpdateTimer: number | null = null;
    
    // 鼠标移动事件处理器
    const handleMouseMove = (event: MouseEvent) => {
      // 更新当前鼠标位置
      currentMousePosition = { x: event.clientX, y: event.clientY };
      
      // 如果弹窗已存在，使用节流更新其位置
      if (floatingPreviewRoot && floatingPreviewContainer) {
        if (mouseUpdateTimer) {
          cancelAnimationFrame(mouseUpdateTimer);
        }
        mouseUpdateTimer = requestAnimationFrame(() => {
          updateFloatingPreviewPosition();
          mouseUpdateTimer = null;
        });
      }
    };
    
    // 更新弹窗位置
    const updateFloatingPreviewPosition = () => {
      if (floatingPreviewRoot && settings) {
        // 重新渲染组件，传入新的鼠标位置
        floatingPreviewRoot.render(
          React.createElement(FloatingPreview, {
            url: draggedLink?.href || '',
            settings: settings!,
            mousePosition: currentMousePosition, // 传递鼠标位置
            onClose: closeFloatingPreview
          })
        );
      }
    };

    // 创建FloatingPreview组件
    const createFloatingPreview = (url: string) => {
      if (!settings?.enabled || floatingPreviewContainer) return;
      
      // 获取合适的容器尺寸
      const contentSize = getContentAreaSize();
      
      // 更新设置中的尺寸
      if (settings) {
        settings.width = contentSize.width;
        settings.height = contentSize.height;
      }
      
      // 创建容器 - 悬浮在网页主体内容上方
      floatingPreviewContainer = document.createElement('div');
      floatingPreviewContainer.id = 'floating-preview-container';
      floatingPreviewContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 999999;
        pointer-events: none;
      `;
      
      document.body.appendChild(floatingPreviewContainer);
      
      // 创建React根节点
      floatingPreviewRoot = createRoot(floatingPreviewContainer);
      
      // 渲染FloatingPreview组件，传入当前鼠标位置
      floatingPreviewRoot.render(
        React.createElement(FloatingPreview, {
          url: url,
          settings: settings!,
          mousePosition: currentMousePosition, // 传递鼠标位置
          onClose: closeFloatingPreview
        })
      );
    };
    
    // 关闭FloatingPreview
    const closeFloatingPreview = () => {
      if (floatingPreviewRoot) {
        floatingPreviewRoot.unmount();
        floatingPreviewRoot = null;
      }
      
      if (floatingPreviewContainer) {
        document.body.removeChild(floatingPreviewContainer);
        floatingPreviewContainer = null;
      }
    };
    
    // 监听链接的拖拽开始事件
    const handleDragStart = (event: DragEvent) => {
      const target = event.target as HTMLElement;
      
      // 检查是否是链接元素
      if (target.tagName === 'A' && target instanceof HTMLAnchorElement) {
        isDragging = true;
        draggedLink = target;
        console.log('Link drag started:', target.href);
      }
    };
    
    // 监听拖拽结束事件
    const handleDragEnd = (event: DragEvent) => {
      if (isDragging && draggedLink && settings?.dragToTrigger) {
        const url = draggedLink.href;
        
        // 检查URL是否有效
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
          console.log('Creating FloatingPreview for:', url);
          createFloatingPreview(url);
        }
      }
      
      isDragging = false;
      draggedLink = null;
    };
    
    // 监听悬停事件（如果启用）
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (settings?.showOnHover && target.tagName === 'A' && target instanceof HTMLAnchorElement) {
        const url = target.href;
        
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
          setTimeout(() => {
            if (!floatingPreviewContainer) {
              createFloatingPreview(url);
            }
          }, settings.hoverDelay);
        }
      }
    };
    
    // 初始化
    const init = async () => {
      await loadSettings();
      
      if (settings?.enabled) {
        // 添加事件监听器
        document.addEventListener('dragstart', handleDragStart, true);
        document.addEventListener('dragend', handleDragEnd, true);
        document.addEventListener('mousemove', handleMouseMove, true); // 添加鼠标移动监听
        
        if (settings.showOnHover) {
          document.addEventListener('mouseenter', handleMouseEnter, true);
        }
        
        console.log('FloatingPreview initialized with settings:', settings);
      }
    };
    
    // 清理函数
    const cleanup = () => {
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('dragend', handleDragEnd, true);
      document.removeEventListener('mousemove', handleMouseMove, true); // 移除鼠标移动监听
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      closeFloatingPreview();
    };
    
    // 监听设置变化
    browser.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        let shouldUpdatePreview = false;
        
        // 监听弹窗设置变化
        if (changes.floatingPreviewSettings) {
          const newSettings = changes.floatingPreviewSettings.newValue;
          if (newSettings) {
            settings = newSettings;
            shouldUpdatePreview = true;
          }
        }
        
        // 监听主题设置变化
        if (changes.themeSettings) {
          const newThemeSettings = changes.themeSettings.newValue;
          if (newThemeSettings && settings) {
            // 根据新的全局主题设置更新弹窗主题
            const newFloatingPreviewTheme = determineFloatingPreviewTheme(newThemeSettings.theme);
            settings.theme = newFloatingPreviewTheme;
            shouldUpdatePreview = true;
          }
        }
        
        // 如果设置有变化且当前有预览窗口，更新其样式
        if (shouldUpdatePreview && floatingPreviewRoot) {
          updateFloatingPreviewPosition();
        }
        
        console.log('FloatingPreview settings updated:', settings);
      }
    });
    
    // 启动
    init();
    
    // 页面卸载时清理
    window.addEventListener('beforeunload', cleanup);
  },
});
