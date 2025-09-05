import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import { ThemeStyles, FloatingPreviewSettings, FloatingPreviewProps } from '../../types/floating-preview';

// 悬浮窗组件
const FloatingPreview: React.FC<FloatingPreviewProps> = ({
  url,
  settings,
  mousePosition,
  onClose
}) => {
  
  // 悬浮窗状态管理
  const [position, setPosition] = useState(() => {
    // 弹窗在容器中居中显示，由于容器已经通过CSS居中，这里设置为0
    return { x: 0, y: 0 }
  });
  const [size, setSize] = useState({ width: settings.width, height: settings.height });
  const [isPinned, setIsPinned] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isFollowingMouse, setIsFollowingMouse] = useState(true); // 是否跟随鼠标
  
  // DOM引用
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  
  // 计算弹窗位置（跟随鼠标或拖拽位置）
  const calculatePosition = () => {
    if (!isFollowingMouse || isDragging) {
      // 如果不跟随鼠标或正在拖拽，使用当前position
      return position;
    }
    
    if (mousePosition) {
      // 跟随鼠标，添加偏移避免遮挡鼠标
      const offset = 20;
      let x = mousePosition.x + offset;
      let y = mousePosition.y + offset;
      
      // 边界检测，防止弹窗超出视口
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // 右边界检测
      if (x + size.width > viewportWidth) {
        x = mousePosition.x - size.width - offset;
      }
      
      // 下边界检测
      if (y + size.height > viewportHeight) {
        y = mousePosition.y - size.height - offset;
      }
      
      // 左边界检测
      if (x < 0) {
        x = 10;
      }
      
      // 上边界检测
      if (y < 0) {
        y = 10;
      }
      
      return { x, y };
    }
    
    return position;
  };

  // 获取主题样式
  const getThemeStyles = () => {
    const { theme } = settings
    
    const themes = {
      light: {
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        textColor: '#374151',
        headerBg: '#f9fafb',
        border: 'border-gray-200',
        bg: 'bg-white'
      },
      dark: {
        backgroundColor: '#1f2937',
        borderColor: '#374151',
        textColor: '#f9fafb',
        headerBg: '#111827',
        border: 'border-gray-600',
        bg: 'bg-gray-800'
      },
      blue: {
        backgroundColor: '#dbeafe',
        borderColor: '#3b82f6',
        textColor: '#1e40af',
        headerBg: '#bfdbfe',
        border: 'border-blue-500',
        bg: 'bg-blue-100'
      },
      red: {
        backgroundColor: '#fecaca',
        borderColor: '#ef4444',
        textColor: '#dc2626',
        headerBg: '#fca5a5',
        border: 'border-red-500',
        bg: 'bg-red-100'
      },
      yellow: {
        backgroundColor: '#fef3c7',
        borderColor: '#f59e0b',
        textColor: '#d97706',
        headerBg: '#fed7aa',
        border: 'border-yellow-500',
        bg: 'bg-yellow-100'
      },
      green: {
        backgroundColor: '#d1fae5',
        borderColor: '#10b981',
        textColor: '#059669',
        headerBg: '#a7f3d0',
        border: 'border-green-500',
        bg: 'bg-green-100'
      }
    }
    
    return themes[theme] || themes.light
  };
  
  const themeStyles = getThemeStyles();
  
  // 处理拖拽开始
  const handleDragStart = (e: React.MouseEvent) => {
    if (isResizing) return;
    setIsDragging(true);
    setIsFollowingMouse(false); // 开始拖拽时停止跟随鼠标
    const currentPos = calculatePosition();
    dragStartRef.current = {
      x: e.clientX - currentPos.x,
      y: e.clientY - currentPos.y
    };
  };
  
  // 处理拖拽移动
  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    
    // 限制在屏幕范围内
    const maxX = window.innerWidth - size.width;
    const maxY = window.innerHeight - size.height;
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };
  
  // 处理拖拽结束
  const handleDragEnd = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };
  
  // 处理尺寸变化
  const handleResize = (newSize: { width?: number; height?: number }) => {
    setSize(prev => ({
      width: newSize.width ?? prev.width,
      height: newSize.height ?? prev.height
    }));
  };
  
  // 处理固定状态切换
  const handleTogglePin = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    if (newPinned) {
      // 固定时停止跟随鼠标
      setIsFollowingMouse(false);
      setPosition(calculatePosition()); // 保存当前位置
    } else {
      // 取消固定时恢复跟随鼠标
      setIsFollowingMouse(true);
    }
  };
  
  // 处理在新标签页打开
  const handleOpenInNewTab = () => {
    window.open(url, '_blank');
  };
  
  // 处理刷新
  const handleRefresh = () => {
    // 通过重新设置iframe的src来刷新
    const iframe = containerRef.current?.querySelector('iframe');
    if (iframe) {
      const currentSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 100);
    }
  };
  
  // 监听全局鼠标事件
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging]);
  
  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isPinned) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPinned, onClose]);
  
  const currentPosition = calculatePosition();

  // 渲染悬浮窗
  const floatingWindow = (
    <div
      ref={containerRef}
      className={`fixed shadow-2xl rounded-lg overflow-hidden ${themeStyles.bg} ${themeStyles.border} border-2`}
      style={{
        width: size.width,
        height: size.height,
        top: `${currentPosition.y}px`,
        left: `${currentPosition.x}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        opacity: settings.opacity,
        pointerEvents: 'auto',
        zIndex: 999999,
        transition: isFollowingMouse && !isDragging ? 'none' : 'all 0.2s ease-out' // 跟随鼠标时无过渡，拖拽时有过渡
      }}
    >
      {/* Header组件 */}
      <Header
          url={url}
          isPinned={isPinned}
          themeStyles={themeStyles}
          onTogglePin={handleTogglePin}
          onRefresh={handleRefresh}
          onOpenInNewTab={handleOpenInNewTab}
          onClose={onClose}
          onDragStart={handleDragStart}
        />
      
      {/* Content组件 */}
      <Content
          url={url}
          width={size.width}
          height={size.height - 40}
          themeStyles={themeStyles}
          onWidthResize={handleResize}
        />
      
      {/* Footer组件 */}
      <Footer
          width={size.width}
          height={size.height}
          themeStyles={themeStyles}
          onHeightResize={handleResize}
          onCornerResize={handleResize}
        />
    </div>
  );

  // 使用Portal渲染到body
  return createPortal(floatingWindow, document.body);
};

export default FloatingPreview;