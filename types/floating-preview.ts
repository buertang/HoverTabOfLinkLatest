// FloatingPreview组件相关的类型定义

// 主题样式接口
export interface ThemeStyles {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  headerBg: string;
  border: string;
  bg: string;
}

// FloatingPreview设置接口
export interface FloatingPreviewSettings {
  enabled: boolean;
  theme: 'light' | 'dark';
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  width: number;
  height: number;
  backgroundOpacity: number; // 背景遮罩透明度：0-100
  opacity: number;
  dragToTrigger: boolean;
  showOnHover: boolean;
  hoverDelay: number;
  autoClose: boolean;
  autoCloseDelay: number;
}

// FloatingPreview组件的Props接口
export interface FloatingPreviewProps {
  url: string;
  settings: FloatingPreviewSettings;
  mousePosition?: { x: number; y: number }; // 鼠标位置，可选
  onClose: () => void;
}

// Header组件的Props接口
export interface HeaderProps {
  url: string;
  isPinned: boolean;
  themeStyles: ThemeStyles;
  onTogglePin: () => void;
  onRefresh: () => void;
  onOpenInNewTab: () => void;
  onClose: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  // 新增：当按钮区域或布局变化时，回传建议的最小窗口宽度（像素）
  onHeaderMinWidthChange?: (minWidth: number) => void;
}

// Content组件的Props接口
export interface ContentProps {
  url: string;
  width: number;
  height: number;
  themeStyles: ThemeStyles;
}

// Footer组件的Props接口
export interface FooterProps {
  width: number;
  height: number;
  themeStyles: ThemeStyles;
  onHeightResize: (newSize: { width?: number; height?: number }) => void;
  onCornerResize: (newSize: { width?: number; height?: number }) => void;
}