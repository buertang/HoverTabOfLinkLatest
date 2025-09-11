import React from 'react';
import { createRoot } from 'react-dom/client';
import FloatingPreview from './FloatingPreview';
import { LinkPreviewSettings, ThemeSettings, DragTextSettings } from '@/types/settings';
import { FloatingPreviewSettings as FloatingPreviewSettingsType } from '@/types/floating-preview';

// 将本地运行时设置命名为 ResolvedLinkPreviewSettings，避免与全局类型名混淆
interface ResolvedLinkPreviewSettings extends LinkPreviewSettings {
  enabled: boolean;
  theme: 'light' | 'dark';
}

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    /**
     * EventEmitter监听器数量限制管理
     * 
     * 功能说明：
     * 1. 防止"MaxListenersExceededWarning"警告出现
     * 2. 根据Chrome扩展特殊环境设置合理的监听器数量上限
     * 3. 提供动态监控和调整机制，确保系统稳定性
     * 4. 与现有内存泄漏防护机制协同工作
     */
    const setupEventEmitterLimits = () => {
      try {
        // Chrome扩展环境推荐的监听器数量限制（考虑多实例悬浮窗、主题监听等）
        const RECOMMENDED_MAX_LISTENERS = 10;
        
        // 获取全局EventEmitter构造函数（如果存在）
        const EventEmitter = (globalThis as any).EventEmitter || (globalThis as any).events?.EventEmitter;
        
        if (EventEmitter && typeof EventEmitter.defaultMaxListeners !== 'undefined') {
          // 设置全局默认监听器数量限制
          EventEmitter.defaultMaxListeners = RECOMMENDED_MAX_LISTENERS;
          console.debug(`FloatingPreview: EventEmitter全局监听器限制已设置为 ${RECOMMENDED_MAX_LISTENERS}`);
        }
        
        // 针对可能存在的Node.js环境EventEmitter（通过require获取）
         try {
           const nodeEvents = (globalThis as any).require?.('events');
           if (nodeEvents && nodeEvents.EventEmitter) {
             nodeEvents.EventEmitter.defaultMaxListeners = RECOMMENDED_MAX_LISTENERS;
             console.debug(`FloatingPreview: Node.js EventEmitter监听器限制已设置为 ${RECOMMENDED_MAX_LISTENERS}`);
           }
         } catch {
           // Node.js环境不存在或require失败，忽略此设置
         }
        
        // 监听器数量监控机制：定期检查并警告
        const monitorListeners = () => {
          try {
            // 检查系统主题监听器（这是最容易超限的监听器）
            if (window.matchMedia) {
              const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
              if (mediaQuery && typeof (mediaQuery as any).listenerCount === 'function') {
                const count = (mediaQuery as any).listenerCount('change');
                if (count > RECOMMENDED_MAX_LISTENERS * 0.8) {
                  console.warn(`FloatingPreview: 系统主题监听器数量接近上限 (${count}/${RECOMMENDED_MAX_LISTENERS})`);
                }
              }
            }
          } catch (error) {
            // 监控失败不影响主要功能
            console.debug('FloatingPreview: 监听器数量监控失败', error);
          }
        };
        
        // 每30秒检查一次监听器数量（避免频繁检查影响性能）
        const monitorInterval = setInterval(monitorListeners, 30000);
        
        // 页面卸载时清理监控定时器
        const cleanup = () => {
          clearInterval(monitorInterval);
          console.debug('FloatingPreview: EventEmitter监听器监控已清理');
        };
        
        // 注册清理函数到页面卸载事件
        window.addEventListener('beforeunload', cleanup, { once: true });
        window.addEventListener('pagehide', cleanup, { once: true });
        
        return {
          maxListeners: RECOMMENDED_MAX_LISTENERS,
          cleanup
        };
        
      } catch (error) {
        // 设置失败不影响主要功能，记录错误并继续执行
        console.warn('FloatingPreview: EventEmitter监听器限制设置失败', error);
        return {
          maxListeners: 10, // 使用默认值
          cleanup: () => {}
        };
      }
    };
    
    // 初始化EventEmitter监听器限制管理
    const listenerManager = setupEventEmitterLimits();
    
    /**
     * 注入Tailwind样式 - 安全优化版本
     * 
     * 主要优化内容：
     * 1. CSS作用域限制：所有样式仅作用于 .floating-preview-container 及其子元素
     * 2. 防止样式污染：避免影响宿主页面的原有样式和布局
     * 3. 安全性增强：防止CSS注入攻击扩散到其他页面元素
     * 4. 性能优化：避免重复注入，减少DOM操作开销
     */
    // Tailwind 样式注入已由 FloatingPreview 组件内部负责，此处移除遗留注释代码

    // 状态变量
    let isDragging = false; // 拖拽链接状态
    let draggedLink: HTMLAnchorElement | null = null; // 当前拖拽的链接
    // 新增：拖拽文字状态
    let isDraggingText = false; // 是否正在拖拽文本
    let draggedText: string | null = null; // 当前拖拽的文本内容
    // legacy single-instance variable removed
    // 多实例悬浮窗：维护实例集合
    let previews = new Map<string, { container: HTMLElement; root: any; url: string; createdAt: number }>();
    let windowSeq = 0; // 用于生成唯一ID
     let settings: ResolvedLinkPreviewSettings | null = null; // 运行时设置
    // 新增：拖拽文字设置（来自侧边栏开关与下拉）
    let dragTextSettings: DragTextSettings = {
      // 默认值与DEFAULT_SETTINGS保持一致
      searchEngine: 'bing', // 默认搜索引擎
      enabled: true, // 开关：是否启用拖拽文字功能（默认开启，首次使用即可生效）
      disabledSites: '' // 禁用站点列表
    };
    // 记录用户在侧边栏选择的主题模式（light/dark/system），用于判断是否需要跟随系统
    let themeMode: 'system' | 'light' | 'dark' = 'system';
    // 系统主题监听器（仅当 themeMode === 'system' 时生效）
    let systemMediaQuery: MediaQueryList | null = null;
    // 记录拖拽/悬停过程的最后鼠标位置，用于计算悬浮窗初始坐标
    let lastMousePos: { x: number; y: number } | null = null;
    // 多实例版本不再使用全局最近预览信息
    // 新增：记录上次窗口尺寸与位置（用于 popupSize='last' 和 popupPosition='last'）
    let lastWindowSize: { width: number; height: number } | null = null;
    let lastWindowPosition: { x: number; y: number } | null = null;

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

    // 新增：解析“禁用站点列表”为数组
    const parseDisabledSites = (raw: string): string[] => {
      return raw
        .split('\n')
        .map((s) => s.trim().toLowerCase())
        .filter((s) => !!s);
    };

    // 新增：判断当前站点是否被禁用
    const isSiteDisabled = (hostname: string, list: string[]): boolean => {
      const host = (hostname || '').toLowerCase();
      return list.some((rule) => {
        if (!rule) return false;
        // 支持以*.开头的通配，例如 *.example.com
        if (rule.startsWith('*.')) {
          const base = rule.slice(2);
          return host === base || host.endsWith('.' + base);
        }
        // 一般匹配：末尾匹配即可（包含子域）
        return host === rule || host.endsWith('.' + rule);
      });
    };

    // 新增：判断文本是否为URL，并返回规范化后的URL（若不是则返回null）
    const normalizeUrlFromText = (text: string): string | null => {
      try {
        const t = (text || '').trim();
        if (!t) return null;
        // 去除两端引号/空白
        const cleaned = t.replace(/^['"\s]+|['"\s]+$/g, '');
        // 直接是http(s)开头
        if (/^https?:\/\//i.test(cleaned)) return cleaned;
        // 形如 www.example.com 或 example.com/path
        if (/^(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/\S*)?$/i.test(cleaned)) {
          return 'https://' + cleaned;
        }
        return null;
      } catch {
        return null;
      }
    };

    // 新增：构造搜索引擎查询URL
    const buildSearchUrl = (engine: DragTextSettings['searchEngine'], query: string): string => {
      const q = encodeURIComponent(query.trim());
      switch (engine) {
        case 'google':
          return `https://www.google.com/search?q=${q}`;
        case 'baidu':
          return `https://www.baidu.com/s?wd=${q}&ie=utf-8&cl=3`;
        case 'duckduckgo':
          return `https://duckduckgo.com/?q=${q}`;
        case 'perplexity':
          return `https://www.perplexity.ai/search?q=${q}`;
        case 'bing':
        default:
          return `https://www.bing.com/search?q=${q}`;
      }
    };

    // 加载设置（包含上次窗口尺寸与位置）
    const loadSettings = async () => {
      try {
        // 仅从 sync 读取用户设置和窗口状态
        const syncRes = await browser.storage.sync.get(['linkPreviewSettings', 'themeSettings', 'dragTextSettings', 'floatingPreviewLastSize', 'floatingPreviewLastPosition']);

        const result: any = {
          linkPreviewSettings: (syncRes as any).linkPreviewSettings,
          themeSettings: (syncRes as any).themeSettings,
          dragTextSettings: (syncRes as any).dragTextSettings,
          floatingPreviewLastSize: (syncRes as any).floatingPreviewLastSize,
          floatingPreviewLastPosition: (syncRes as any).floatingPreviewLastPosition,
        };

        const rawLinkPreviewSettings: LinkPreviewSettings = result.linkPreviewSettings || {
          triggerMethod: 'drag',
          customShortcut: 'Alt',
          hoverDelay: 100,
          longPressDelay: 500,
          popupSize: 'medium',
          popupPosition: 'center',
          backgroundOpacity: 50,
          maxFloatingWindows: 3,
          autoPin: false,
        } as any;

        const linkPreviewSettings: LinkPreviewSettings = {
          ...rawLinkPreviewSettings
        } as LinkPreviewSettings;

        // 读取拖拽文字设置
        const rawDTS: DragTextSettings = result.dragTextSettings || {
          searchEngine: 'bing',
          enabled: true, // 兜底：默认开启
          disabledSites: ''
        };
        dragTextSettings = { ...rawDTS };

        // 读取上次窗口尺寸（如果有）
        if (result.floatingPreviewLastSize && typeof result.floatingPreviewLastSize.width === 'number' && typeof result.floatingPreviewLastSize.height === 'number') {
          lastWindowSize = {
            width: result.floatingPreviewLastSize.width,
            height: result.floatingPreviewLastSize.height
          };
        } else {
          lastWindowSize = null;
        }
        // 读取上次窗口位置（如果有）
        if (result.floatingPreviewLastPosition && typeof result.floatingPreviewLastPosition.x === 'number' && typeof result.floatingPreviewLastPosition.y === 'number') {
          lastWindowPosition = {
            x: result.floatingPreviewLastPosition.x,
            y: result.floatingPreviewLastPosition.y,
          };
        } else {
          lastWindowPosition = null;
        }

        const themeSettings: ThemeSettings = result.themeSettings || { theme: 'system' };
        // 记录原始主题模式（是否为 system）
        themeMode = themeSettings.theme;
        const resolvedTheme = determineTheme(themeSettings.theme);

        settings = {
          ...linkPreviewSettings,
          enabled: linkPreviewSettings.triggerMethod !== 'disabled',
          theme: resolvedTheme
        } as ResolvedLinkPreviewSettings;
      } catch (error) {
        settings = {
          triggerMethod: 'drag',
          customShortcut: 'Alt',
          hoverDelay: 200, // 毫秒
          longPressDelay: 500, // 毫秒
          popupSize: 'medium',
          popupPosition: 'center',
          backgroundOpacity: 60,
          maxFloatingWindows: 3,
          autoPin: false,
          enabled: true,
          theme: getSystemTheme()
        } as ResolvedLinkPreviewSettings;
        themeMode = 'system';
        lastWindowSize = null;
        lastWindowPosition = null;
        dragTextSettings = { searchEngine: 'bing', enabled: true, disabledSites: '' };
      }
    };

    // 统一渲染函数：用于首次创建和主题变更时的重新渲染
    const renderFloatingPreview = (url: string, x: number, y: number, opts?: { id?: string; forRerender?: boolean; onClose?: () => void }) => {
      if (!settings) return;
      const { id, forRerender, onClose } = opts || {};

      const vw = Math.max(320, window.innerWidth || 0);
      const vh = Math.max(240, window.innerHeight || 0);
      const margin = 16;

      // 计算尺寸：根据设置选择 small/medium/large 或上次尺寸
      const resolveSize = () => {
        const minW = 320;
        const minH = 240;
        if (settings!.popupSize === 'last' && lastWindowSize) {
          return lastWindowSize;
        }
        if (settings!.popupSize === 'small') {
          return { width: 400, height: 300 };
        }
        if (settings!.popupSize === 'large') {
          return {
            width: Math.max(minW, vw - margin * 2),
            height: Math.max(minH, vh - margin * 2),
          };
        }
        // 默认 medium
        return { width: 800, height: 600 };
      };
      const sizeToUse = resolveSize();

      // 计算初始位置：根据 popupPosition 传递给悬浮窗组件
      let initialPosition: { x: number; y: number } | undefined;
      if (settings.popupPosition === 'center') {
        initialPosition = {
          x: Math.max(margin, (vw - sizeToUse.width) / 2),
          y: Math.max(margin, (vh - sizeToUse.height) / 2),
        };
      } else if (settings.popupPosition === 'left') {
        initialPosition = {
          x: margin,
          y: Math.max(margin, (vh - sizeToUse.height) / 2),
        };
      } else if (settings.popupPosition === 'right') {
        initialPosition = {
          x: Math.max(margin, vw - sizeToUse.width - margin),
          y: Math.max(margin, (vh - sizeToUse.height) / 2),
        };
      } else if (settings.popupPosition === 'last' && lastWindowPosition) {
        // 约束到当前视口范围内，避免离屏
        const clampedX = Math.min(
          Math.max(margin, lastWindowPosition.x),
          Math.max(margin, vw - sizeToUse.width - margin)
        );
        const clampedY = Math.min(
          Math.max(margin, lastWindowPosition.y),
          Math.max(margin, vh - sizeToUse.height - margin)
        );
        initialPosition = { x: clampedX, y: clampedY };
      } else {
        // 兜底：居中
        initialPosition = {
          x: Math.max(margin, (vw - sizeToUse.width) / 2),
          y: Math.max(margin, (vh - sizeToUse.height) / 2),
        };
      }

      // 组件设置：位置枚举保留 center 即可，具体像素由 initialPosition 强制
      const floatingPreviewSettings: FloatingPreviewSettingsType = {
        enabled: settings.enabled || true,
        theme: settings.theme || 'light',
        position: 'center',
        width: sizeToUse.width,
        height: sizeToUse.height,
        opacity: 1,
        backgroundOpacity: settings.backgroundOpacity || 80, // 背景遮罩透明度
        dragToTrigger: settings.triggerMethod === 'drag',
        showOnHover: settings.triggerMethod === 'hover' || settings.triggerMethod === 'customHover',
        hoverDelay: settings.hoverDelay || 200, // 毫秒
        longPressDelay: settings.longPressDelay || 500,
        autoClose: false,
        autoCloseDelay: 3000,
        autoPin: settings.autoPin ?? false,
      };

      const element = React.createElement(FloatingPreview, {
        url,
        settings: floatingPreviewSettings,
        mousePosition: forRerender ? undefined : { x, y },
        initialPosition: forRerender ? undefined : initialPosition,
        onClose: onClose ?? (() => {}),
        windowId: id,
      });

      return element;
    };

    // 关闭指定ID的悬浮窗，并记录最后位置与尺寸
    const closePreviewInstance = (id: string) => {
      try {
        const targetEl = document.getElementById(`floating-preview-window-${id}`) as HTMLElement | null;
        const rect = targetEl?.getBoundingClientRect();
        if (rect && rect.width > 0 && rect.height > 0) {
          const vw = Math.max(0, window.innerWidth || 0);
          const vh = Math.max(0, window.innerHeight || 0);
          const margin = 16;
          const x = Math.round(Math.min(Math.max(margin, rect.left), Math.max(margin, vw - rect.width - margin)));
          const y = Math.round(Math.min(Math.max(margin, rect.top), Math.max(margin, vh - rect.height - margin)));
          const width = Math.round(rect.width);
          const height = Math.round(rect.height);
          browser.storage.local.set({
            floatingPreviewLastPosition: { x, y },
            floatingPreviewLastSize: { width, height },
          });
          // 同步存储一份
          browser.storage.sync.set({
            floatingPreviewLastPosition: { x, y },
            floatingPreviewLastSize: { width, height },
          });
        }
      } catch {}
      const inst = previews.get(id);
      if (inst) {
        try { inst.root.unmount(); } catch {}
        try { document.body.removeChild(inst.container); } catch {}
        previews.delete(id);
      }
    };

    const closeAllPreviews = () => {
      Array.from(previews.keys()).forEach((id) => closePreviewInstance(id));
    };

    // 创建悬浮预览窗口 - 支持多实例
    const createFloatingPreview = (url: string, x: number, y: number) => {
      if (!settings) return;
      // 达到上限时，关闭最早的实例
      const maxCount = Math.min(6, Math.max(1, (settings as any).maxFloatingWindows ?? 3));
      if (previews.size >= maxCount) {
        const oldest = Array.from(previews.entries()).sort((a, b) => a[1].createdAt - b[1].createdAt)[0];
        if (oldest) closePreviewInstance(oldest[0]);
      }

      const id = `w${Date.now()}-${++windowSeq}`;
      const container = document.createElement('div');
      container.id = `floating-preview-container-${id}`;
      document.body.appendChild(container);
      const root = createRoot(container);
      const element = renderFloatingPreview(url, x, y, { id, onClose: () => closePreviewInstance(id), forRerender: false });
      if (element) {
        root.render(element);
        previews.set(id, { container, root, url, createdAt: Date.now() });
      }
    };

    // 主题或设置变更后，尝试在不销毁的情况下更新现有预览（仅更新主题/遮罩等依赖settings的渲染）
    const rerenderAllPreviews = () => {
      if (!settings) return;
      previews.forEach((inst, id) => {
        const element = renderFloatingPreview(inst.url, 0, 0, { id, onClose: () => closePreviewInstance(id), forRerender: true });
        if (element) inst.root.render(element);
      });
    };

    const rerenderFloatingPreview = () => {
      rerenderAllPreviews();
    };

    const closeFloatingPreview = () => {
      // 统一改为关闭所有实例
      closeAllPreviews();
    };

    const handleDragStart = (event: DragEvent) => {
      const target = event.target as HTMLElement;
      // 1) 优先识别“拖拽链接”，即使页面存在选中文本也应以链接为主
      const anchor = target?.closest?.('a');
      if (anchor && anchor instanceof HTMLAnchorElement) {
        isDragging = true;              // 标记为拖拽链接
        draggedLink = anchor;           // 记录被拖拽的链接
        isDraggingText = false;         // 明确不是拖拽文本
        draggedText = null;             // 清空文本
        return;
      }

      // 2) 其次识别“拖拽文本”：仅当存在选中文本时才进入文本拖拽流程
      const selection = window.getSelection?.();
      const selectedText = selection ? selection.toString().trim() : '';
      if (selectedText) {
        isDraggingText = true;          // 标记为拖拽文本
        draggedText = selectedText;     // 记录文本内容
        isDragging = false;             // 不是拖拽链接
        draggedLink = null;             // 清空链接
        return;
      }

      // 3) 其他情况：不认为是有效拖拽
      isDragging = false;
      draggedLink = null;
      isDraggingText = false;
      draggedText = null;
    };

    // 在拖拽过程中持续记录鼠标位置，避免 dragend 事件 clientX/Y 为 0 的情况
    const handleDragOver = (event: DragEvent) => {
      lastMousePos = { x: event.clientX, y: event.clientY };
    };

    // 拖拽结束（仅当设置为 drag 时触发打开）
    const handleDragEnd = (event: DragEvent) => {
      // 统一获取坐标：优先使用拖拽过程记录的最后鼠标位置
      const posX = (lastMousePos?.x ?? event.clientX ?? 0);
      const posY = (lastMousePos?.y ?? event.clientY ?? 0);

      // 先处理“拖拽文字”功能（按开关控制）
      if (isDraggingText) {
        const text = (draggedText || '').trim();
        // 重置拖拽文字状态
        isDraggingText = false;
        draggedText = null;

        // 功能开关：关闭则直接忽略
        if (!dragTextSettings?.enabled) {
          isDragging = false;
          draggedLink = null;
          lastMousePos = null; // 清理坐标
          return;
        }
        // 禁用站点判断
        const disabledList = parseDisabledSites(dragTextSettings.disabledSites || '');
        if (isSiteDisabled(window.location.hostname, disabledList)) {
          isDragging = false;
          draggedLink = null;
          lastMousePos = null; // 清理坐标
          return;
        }
        if (text) {
          const normalized = normalizeUrlFromText(text);
          const targetUrl = normalized ? normalized : buildSearchUrl(dragTextSettings.searchEngine, text);
          // 对百度、Perplexity、Google、DuckDuckGo 搜索结果采用新标签打开，避免 X-Frame-Options/CSP 导致的 iframe 拒绝加载
          try {
            const host = new URL(targetUrl).hostname.toLowerCase();
            if (host.endsWith('baidu.com') || host.endsWith('perplexity.ai') || host.endsWith('google.com') || host.endsWith('duckduckgo.com')) {
              window.open(targetUrl, '_blank');
              lastMousePos = null; // 清理坐标
              return;
            }
          } catch (_) {}
          createFloatingPreview(targetUrl, posX, posY);
        }
        isDragging = false;
        draggedLink = null;
        lastMousePos = null; // 清理坐标
        return;
      }

      // 其次处理“拖拽链接”逻辑（保持原有行为）
      if (isDragging && draggedLink && settings?.triggerMethod === 'drag') {
        const url = draggedLink.href;
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
          createFloatingPreview(url, posX, posY);
        }
      }
      isDragging = false;
      draggedLink = null;
      lastMousePos = null; // 清理坐标
    };

    // 悬停触发（纯 hover 或 customHover 且按下修饰键）
    // 定时器引用：用于防止内存泄漏，确保在清理时能正确移除
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
        // 百度页面和Perplexity页面不支持被 iframe 嵌入，直接新开标签
        try {
          const host = new URL(href).hostname.toLowerCase();
          if (host.endsWith('baidu.com') || host.endsWith('perplexity.ai') || host.endsWith('google.com') || host.endsWith('duckduckgo.com')) {
            window.open(href, '_blank');
            return;
          }
        } catch (_) {}
        createFloatingPreview(href, event.clientX, event.clientY);
      }, delay) as unknown as number;
    };

    const handleMouseLeave = (event: MouseEvent) => {
      // 鼠标离开时清理悬停定时器，防止定时器持续运行造成内存泄漏
      if (hoverTimer) {
        window.clearTimeout(hoverTimer);
        hoverTimer = null;
      }
    };

    // 长按触发：按下开始计时，超时后触发
    // 定时器引用：用于防止内存泄漏，确保在清理时能正确移除
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
        // 百度页面和Perplexity页面不支持被 iframe 嵌入，直接新开标签
        try {
          const host = new URL(href).hostname.toLowerCase();
          if (host.endsWith('baidu.com') || host.endsWith('perplexity.ai') || host.endsWith('google.com') || host.endsWith('duckduckgo.com')) {
            window.open(href, '_blank');
            // 标记长按已触发，避免后续click跳转
            suppressNextClick = true;
            return;
          }
        } catch (_) {}
        createFloatingPreview(href, event.clientX, event.clientY);
        // 标记：本次为长按触发，下一次 click 需要被抑制（避免跳转）
        suppressNextClick = true;
      }, delay) as unknown as number;

      // 阻止默认选择行为，避免拖选文字
      try { event.preventDefault(); } catch {}
    };

    const handleMouseUp = () => {
      // 鼠标抬起时清理长按定时器，防止定时器持续运行造成内存泄漏
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
      if (mod === 'Ctrl') return (e as MouseEvent).ctrlKey || (e as KeyboardEvent).ctrlKey;
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
      // 百度页面和Perplexity页面不支持被 iframe 嵌入，直接新开标签
      try {
        const host = new URL(href).hostname.toLowerCase();
        if (host.endsWith('baidu.com') || host.endsWith('perplexity.ai') || host.endsWith('google.com') || host.endsWith('duckduckgo.com')) {
          window.open(href, '_blank');
          return;
        }
      } catch (_) {}
      createFloatingPreview(href, event.clientX, event.clientY);
    };

    // 监听修饰键按下/抬起，用于 customHover
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!settings) return;
      const mod = settings.customShortcut;
      if ((mod === 'Alt' && e.altKey) || (mod === 'Cmd' && e.metaKey) || (mod === 'Shift' && e.shiftKey) || (mod === 'Ctrl' && e.ctrlKey)) {
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
      if (mod === 'Ctrl' && !e.ctrlKey) modifierActive = false;
    };

    const handleWindowBlur = () => { 
      // 窗口失焦时重置修饰键状态，防止状态异常
      modifierActive = false; 
    };

    // 监听系统主题变化（仅当主题模式为 system 时生效）
    // 主题监听器清理函数引用：用于防止内存泄漏
    let systemThemeCleanup: (() => void) | null = null;
    const setupSystemThemeListener = () => {
      try {
        systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
          if (themeMode === 'system') {
            const newTheme = getSystemTheme();
            if (settings && settings.theme !== newTheme) {
              settings = { ...(settings as ResolvedLinkPreviewSettings), theme: newTheme };
              rerenderAllPreviews();
            }
          }
        };
        systemMediaQuery.addEventListener('change', handler);
        // 保存清理函数引用，确保能在cleanup时正确移除监听器
        systemThemeCleanup = () => {
          try { 
            systemMediaQuery?.removeEventListener('change', handler);
            systemMediaQuery = null;
          } catch {}
        };
      } catch {}
    };

    /**
     * 浏览器存储变更监听器
     * 当用户在其他标签页或扩展设置中修改配置时，实时更新当前页面的设置
     * 注意：此监听器在cleanup函数中被正确移除，防止内存泄漏
     */
    const handleStorageChange = async (changes: any, namespace: string) => {
      // 同时监听 sync 与 local
      if (namespace === 'sync') {
        if (changes.linkPreviewSettings || changes.themeSettings || changes.floatingPreviewLastSize || changes.floatingPreviewLastPosition) {
          await loadSettings();
          rerenderAllPreviews();
        }
        if (changes.dragTextSettings) {
          try {
            const result = await browser.storage.sync.get(['dragTextSettings']);
            const rawDTS: DragTextSettings = (result as any).dragTextSettings || {
              searchEngine: 'bing',
              enabled: true, // 兜底：默认开启
              disabledSites: ''
            };
            dragTextSettings = { ...rawDTS };
          } catch {}
        }
        return;
      }

      if (namespace === 'local') {
        if (changes.linkPreviewSettings || changes.themeSettings || changes.floatingPreviewLastSize || changes.floatingPreviewLastPosition) {
          // local 变化可能来自旧版本或窗口缓存变化
          await loadSettings();
          rerenderAllPreviews();
        }
        // 监听拖拽文字设置变更（优先从 sync 读，回退 local）
        if (changes.dragTextSettings) {
          try {
            const [syncRes, localRes] = await Promise.all([
              browser.storage.sync.get(['dragTextSettings']),
              browser.storage.local.get(['dragTextSettings']),
            ]);
            const rawDTS: DragTextSettings = (syncRes as any).dragTextSettings ?? (localRes as any).dragTextSettings ?? {
              searchEngine: 'bing',
              enabled: true, // 兜底：默认开启
              disabledSites: ''
            };
            dragTextSettings = { ...rawDTS };
          } catch {}
        }
      }
    };

    // 初始化与清理
    /**
     * 初始化函数 - 设置所有事件监听器和功能
     * 
     * 初始化内容包括：
     * 1. 加载用户设置
     * 2. 注入样式文件
     * 3. 绑定DOM事件监听器
     * 4. 设置浏览器存储监听器
     * 5. 设置系统主题监听器
     * 6. 添加页面卸载清理机制
     */
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
      
      // 页面卸载时的清理机制 - 防止内存泄漏的关键保障
        // 监听页面卸载事件，确保所有资源被正确释放
        const handlePageUnload = () => {
          cleanup();
        };
        
        // 页面隐藏事件处理函数
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'hidden') {
            // 页面隐藏时关闭所有悬浮窗，释放相关资源
            closeFloatingPreview();
          }
        };
        
        // 监听多种页面卸载事件，确保清理逻辑在各种情况下都能执行
        window.addEventListener('beforeunload', handlePageUnload);
        window.addEventListener('unload', handlePageUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // 保存清理函数引用，确保能在cleanup时正确移除监听器
        pageUnloadCleanup = () => {
          window.removeEventListener('beforeunload', handlePageUnload);
          window.removeEventListener('unload', handlePageUnload);
        };
        visibilityChangeCleanup = () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    };

    // 页面卸载监听器引用：用于在cleanup时正确移除
    let pageUnloadCleanup: (() => void) | null = null;
    let visibilityChangeCleanup: (() => void) | null = null;

    /**
     * 统一清理函数 - 防止内存泄漏的核心机制
     * 
     * 清理内容包括：
     * 1. 移除所有DOM事件监听器
     * 2. 清理定时器（防止定时器持续运行）
     * 3. 移除浏览器存储监听器
     * 4. 清理系统主题监听器
     * 5. 移除页面卸载监听器
     * 6. 关闭所有悬浮窗实例
     * 7. 移除注入的样式元素
     * 8. 清理EventEmitter监听器管理器
     */
    const cleanup = () => {
      // 1. 移除DOM事件监听器（防止事件监听器内存泄漏）
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('dragend', handleDragEnd, true);
      document.removeEventListener('dragover', handleDragOver, true); // 记录拖拽过程鼠标坐标
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('mouseup', handleMouseUp, true);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('blur', handleWindowBlur);

      // 2. 清理定时器（防止定时器内存泄漏）
      if (hoverTimer) {
        window.clearTimeout(hoverTimer);
        hoverTimer = null;
      }
      if (longPressTimer) {
        window.clearTimeout(longPressTimer);
        longPressTimer = null;
      }

      // 3. 移除浏览器存储监听器
      try { browser.storage.onChanged.removeListener(handleStorageChange); } catch {}
      
      // 4. 清理系统主题监听器（防止MediaQueryList内存泄漏）
      if (systemThemeCleanup) {
        try { systemThemeCleanup(); } catch {}
        systemThemeCleanup = null;
      }

      // 5. 移除页面卸载监听器（防止页面卸载监听器内存泄漏）
      if (pageUnloadCleanup) {
        try { pageUnloadCleanup(); } catch {}
        pageUnloadCleanup = null;
      }
      if (visibilityChangeCleanup) {
        try { visibilityChangeCleanup(); } catch {}
        visibilityChangeCleanup = null;
      }

      // 6. 关闭所有悬浮窗实例
      closeFloatingPreview();

      // 7. 移除注入的样式元素
      const existingStyle = document.getElementById('floating-preview-tailwind-styles');
      if (existingStyle) existingStyle.remove();
      
      // 8. 清理EventEmitter监听器管理器（防止监听器监控定时器内存泄漏）
      if (listenerManager && typeof listenerManager.cleanup === 'function') {
        try {
          listenerManager.cleanup();
          console.debug('FloatingPreview: EventEmitter监听器管理器已清理');
        } catch (error) {
          console.warn('FloatingPreview: EventEmitter监听器管理器清理失败', error);
        }
      }
    };

    init();
     return cleanup;
   },
 });
