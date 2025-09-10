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
    // 注入Tailwind样式
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

    // 状态变量
    let isDragging = false; // 拖拽链接状态
    let draggedLink: HTMLAnchorElement | null = null; // 当前拖拽的链接
    let floatingPreview: { container: HTMLElement; root: any } | null = null; // 悬浮窗实例
    let settings: ResolvedLinkPreviewSettings | null = null; // 运行时设置
    // 记录用户在侧边栏选择的主题模式（light/dark/system），用于判断是否需要跟随系统
    let themeMode: 'system' | 'light' | 'dark' = 'system';
    // 系统主题监听器（仅当 themeMode === 'system' 时生效）
    let systemMediaQuery: MediaQueryList | null = null;
    // 保存最近一次打开的预览信息，便于在主题变更时重新渲染
    let lastPreviewUrl: string | null = null;
    let lastMousePos: { x: number; y: number } | null = null;

    // 新增：记录上次窗口尺寸（用于 popupSize=lastSize）
    let lastWindowSize: { width: number; height: number } | null = null;

    // 新增：修饰键状态（用于 customHover 与 click）
    let modifierActive = false; // 是否按下了配置的修饰键

    // 新增：长按触发后抑制下一次点击导航
    let suppressNextClick = false;
    // 工具函数：获取系统主题
    const getSystemTheme = () => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // 根据 app 主题设置，解析实际主题
    const determineTheme = (mode: 'system' | 'light' | 'dark'): 'light' | 'dark' => {
      if (mode === 'system') return getSystemTheme();
      return mode;
    };

    // 加载设置（包含上次窗口尺寸）
    const loadSettings = async () => {
      try {
        const result = await browser.storage.local.get(['linkPreviewSettings', 'themeSettings', 'floatingPreviewLastSize']);

        const rawLinkPreviewSettings: LinkPreviewSettings = result.linkPreviewSettings || {
          triggerMethod: 'drag',
          customShortcut: 'Alt',
          hoverDelay: 100,
          longPressDelay: 500,
          popupSize: 'default',
          popupPosition: 'followMouse',
          backgroundOpacity: 50
        };

        // 兼容旧版本：将历史值 altClick 归一为 click，避免无法触发
        const linkPreviewSettings: LinkPreviewSettings = {
          ...rawLinkPreviewSettings,
          triggerMethod: (rawLinkPreviewSettings as any).triggerMethod === 'altClick' ? 'click' : rawLinkPreviewSettings.triggerMethod
        };

        // 读取上次窗口尺寸（如果有）
        if (result.floatingPreviewLastSize && typeof result.floatingPreviewLastSize.width === 'number' && typeof result.floatingPreviewLastSize.height === 'number') {
          lastWindowSize = {
            width: result.floatingPreviewLastSize.width,
            height: result.floatingPreviewLastSize.height
          };
        } else {
          lastWindowSize = null;
        }

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
        lastWindowSize = null;
      }
    };

    // 统一渲染函数：用于首次创建和主题变更时的重新渲染
    const renderFloatingPreview = (url: string, x: number, y: number) => {
      if (!settings) return;

      // 计算尺寸：根据设置选择默认或上次尺寸
      const defaultSize = { width: 800, height: 600 };
      const sizeToUse = settings.popupSize === 'lastSize' && lastWindowSize
        ? lastWindowSize
        : defaultSize;

      // 计算位置偏好：根据 popupPosition 传递到悬浮窗组件
      // followMouse -> 组件跟随鼠标；center -> 居中；topRight -> 右上角
      const positionPref: 'center' | 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left' =
        settings.popupPosition === 'center' ? 'center' : (settings.popupPosition === 'topRight' ? 'top-right' : 'center');
      // drag/hover 等布尔开关供兼容旧Props（内部未必使用）
      const floatingPreviewSettings: FloatingPreviewSettingsType = {
        enabled: settings.enabled || true,
        theme: settings.theme || 'light',
        position: positionPref,
        width: sizeToUse.width,
        height: sizeToUse.height,
        opacity: 1,
        backgroundOpacity: settings.backgroundOpacity || 80, // 背景遮罩透明度
        dragToTrigger: settings.triggerMethod === 'drag',
        showOnHover: settings.triggerMethod === 'hover' || settings.triggerMethod === 'customHover',
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

    // ============= 触发方式实现 =============
    // 拖拽开始
    const handleDragStart = (event: DragEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target?.closest?.('a');
      if (anchor && anchor instanceof HTMLAnchorElement) {
        isDragging = true;
        draggedLink = anchor;
      }
    };

    // 拖拽结束（仅当设置为 drag 时触发打开）
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

    // 悬停触发（纯 hover 或 customHover 且按下修饰键）
    let hoverTimer: number | null = null;
    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target?.closest?.('a');
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.href;
      if (!href || !(href.startsWith('http://') || href.startsWith('https://'))) return;

      if (!settings) return;
      // 仅当 hover 或 customHover（且修饰键按下）时启用
      const isHoverMode = settings.triggerMethod === 'hover';
      const isCustomHoverMode = settings.triggerMethod === 'customHover' && modifierActive;
      if (!isHoverMode && !isCustomHoverMode) return;

      const delay = Math.max(0, settings.hoverDelay || 0);
      if (hoverTimer) window.clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => {
        if (!floatingPreview) {
          createFloatingPreview(href, event.clientX, event.clientY);
        }
      }, delay) as unknown as number;
    };

    const handleMouseLeave = (event: MouseEvent) => {
      if (hoverTimer) {
        window.clearTimeout(hoverTimer);
        hoverTimer = null;
      }
    };

    // 长按触发：按下开始计时，超时后触发
    let longPressTimer: number | null = null;
    const handleMouseDown = (event: MouseEvent) => {
      if (!settings || settings.triggerMethod !== 'longPress') return;
      if (event.button !== 0) return; // 仅左键
      const target = event.target as HTMLElement;
      const anchor = target?.closest?.('a');
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.href;
      if (!href || !(href.startsWith('http://') || href.startsWith('https://'))) return;

      const delay = Math.max(0, settings.longPressDelay || 500);
      if (longPressTimer) window.clearTimeout(longPressTimer);
      longPressTimer = window.setTimeout(() => {
        // 触发时机使用按下位置附近
        createFloatingPreview(href, event.clientX, event.clientY);
        // 标记：本次为长按触发，下一次 click 需要被抑制（避免跳转）
        suppressNextClick = true;
      }, delay) as unknown as number;

      // 阻止默认选择行为，避免拖选文字
      try { event.preventDefault(); } catch {}
    };

    const handleMouseUp = () => {
      if (longPressTimer) {
        window.clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };

    // 修饰键+点击 触发
    const checkModifier = (e: MouseEvent | KeyboardEvent) => {
      if (!settings) return false;
      const mod = settings.customShortcut;
      if (mod === 'Alt') return (e as MouseEvent).altKey || (e as KeyboardEvent).altKey;
      if (mod === 'Cmd') return (e as MouseEvent).metaKey || (e as KeyboardEvent).metaKey;
      if (mod === 'Shift') return (e as MouseEvent).shiftKey || (e as KeyboardEvent).shiftKey;
      return false;
    };

    const handleClick = (event: MouseEvent) => {
      // 若上一动作是长按触发，则抑制这次点击的默认跳转
      if (suppressNextClick) {
        suppressNextClick = false;
        try { event.preventDefault(); event.stopPropagation(); } catch {}
        return;
      }
      if (!settings || settings.triggerMethod !== 'click') return;
      if (event.button !== 0) return; // 仅左键
      const target = event.target as HTMLElement;
      const anchor = target?.closest?.('a');
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.href;
      if (!href || !(href.startsWith('http://') || href.startsWith('https://'))) return;
      // 需要修饰键
      if (!checkModifier(event)) return;
      try { event.preventDefault(); event.stopPropagation(); } catch { }
      createFloatingPreview(href, event.clientX, event.clientY);
    };

    // 监听修饰键按下/抬起，用于 customHover
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!settings) return;
      const mod = settings.customShortcut;
      if ((mod === 'Alt' && e.altKey) || (mod === 'Cmd' && e.metaKey) || (mod === 'Shift' && e.shiftKey)) {
        modifierActive = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!settings) return;
      const mod = settings.customShortcut;
      // 松开目标修饰键或失去任何修饰键都置为false
      if (mod === 'Alt' && !e.altKey) modifierActive = false;
      if (mod === 'Cmd' && !e.metaKey) modifierActive = false;
      if (mod === 'Shift' && !e.shiftKey) modifierActive = false;
    };

    const handleWindowBlur = () => { modifierActive = false; };

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
        (setupSystemThemeListener as any)._remove = () => {
          try { systemMediaQuery?.removeEventListener('change', handler); } catch {}
        };
      } catch {}
    };

    // 存储变更监听：设置或主题变化时重新加载
    const handleStorageChange = async (changes: any, namespace: string) => {
      if (namespace !== 'local') return;
      if (changes.linkPreviewSettings || changes.themeSettings || changes.floatingPreviewLastSize) {
        await loadSettings();
        rerenderFloatingPreview();
      }
    };

    // 初始化与清理
    const init = async () => {
      await loadSettings();

      // 事件监听绑定（捕获阶段，确保优先处理）
      document.addEventListener('dragstart', handleDragStart, true);
      document.addEventListener('dragend', handleDragEnd, true);
      document.addEventListener('mouseenter', handleMouseEnter, true);
      document.addEventListener('mouseleave', handleMouseLeave, true);
      document.addEventListener('mousedown', handleMouseDown, true);
      document.addEventListener('mouseup', handleMouseUp, true);
      document.addEventListener('click', handleClick, true);
      document.addEventListener('keydown', handleKeyDown, true);
      document.addEventListener('keyup', handleKeyUp, true);
      window.addEventListener('blur', handleWindowBlur);

      browser.storage.onChanged.addListener(handleStorageChange);
      setupSystemThemeListener();
    };

    const cleanup = () => {
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('dragend', handleDragEnd, true);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('mouseup', handleMouseUp, true);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('blur', handleWindowBlur);

      try { browser.storage.onChanged.removeListener(handleStorageChange); } catch {}
      if ((setupSystemThemeListener as any)._remove) {
        try { (setupSystemThemeListener as any)._remove(); } catch {}
      }

      closeFloatingPreview();

      const existingStyle = document.getElementById('floating-preview-tailwind-styles');
      if (existingStyle) existingStyle.remove();
    };

    init();
     return cleanup;
   },
 });
