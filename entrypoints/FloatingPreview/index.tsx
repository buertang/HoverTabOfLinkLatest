import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import { ThemeStyles, FloatingPreviewSettings, FloatingPreviewProps } from '../../types/floating-preview';

// 悬浮窗组件 - 使用TailwindCSS重写样式版本
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
  const [isPinned, setIsPinned] = useState(false); // 是否固定窗口
  const [isDragging, setIsDragging] = useState(false); // 是否正在拖拽
  const [isResizing, setIsResizing] = useState(false); // 是否正在调整大小
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

  // 根据主题获取样式类名
  const getThemeStyles = (theme: 'light' | 'dark'): ThemeStyles => {
    if (theme === 'dark') {
      return {
        backgroundColor: 'bg-gray-900',
        borderColor: 'border-gray-700',
        textColor: 'text-white',
        headerBg: 'bg-gray-800',
        border: 'border-gray-700',
        bg: 'bg-gray-900'
      };
    }
    return {
      backgroundColor: 'bg-white',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-900',
      headerBg: 'bg-gray-50',
      border: 'border-gray-300',
      bg: 'bg-white'
    };
  };
  
  const themeStyles = getThemeStyles(settings.theme);
  
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
  
  // 处理拖拽移动 - 优化流畅性和跟手性
  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    
    // 使用requestAnimationFrame确保流畅的动画
    requestAnimationFrame(() => {
      const newX = e.clientX - dragStartRef.current!.x;
      const newY = e.clientY - dragStartRef.current!.y;
      
      // 限制在屏幕范围内，添加边界缓冲
      const buffer = 10;
      const maxX = window.innerWidth - size.width - buffer;
      const maxY = window.innerHeight - size.height - buffer;
      
      setPosition({
        x: Math.max(buffer, Math.min(newX, maxX)),
        y: Math.max(buffer, Math.min(newY, maxY))
      });
    });
  };
  
  // 处理拖拽结束
  const handleDragEnd = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };
  
  // 处理尺寸变化 - 优化响应性能
  const handleResize = (newSize: { width?: number; height?: number }, positionChange?: { x?: number; y?: number }) => {
    // 使用requestAnimationFrame确保流畅的尺寸变化
    requestAnimationFrame(() => {
      setSize(prev => ({
        width: newSize.width ?? prev.width,
        height: newSize.height ?? prev.height
      }));
      
      // 如果有位置变化，同时更新位置
      if (positionChange) {
        setPosition(prev => ({
          x: positionChange.x ?? prev.x,
          y: positionChange.y ?? prev.y
        }));
      }
    });
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

  // 渲染悬浮窗 - 使用TailwindCSS类名和flex布局
  const floatingWindow = (
    <div
      ref={containerRef}
      className={`fixed shadow-2xl rounded-lg overflow-hidden z-[10000] ${themeStyles.backgroundColor} ${themeStyles.borderColor} border-2 transition-all duration-200 ease-in-out flex flex-col`}
      style={{
        width: size.width,
        height: size.height,
        top: `${currentPosition.y}px`,
        left: `${currentPosition.x}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        opacity: settings.opacity,
        pointerEvents: 'auto',
        zIndex: 999999,
        // 优化过渡效果：拖拽时无过渡确保跟手性，其他时候使用平滑过渡
        transition: isDragging ? 'none' : isFollowingMouse ? 'none' : 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        // 添加硬件加速
        transform: 'translateZ(0)',
        willChange: isDragging ? 'transform' : 'auto'
      }}
    >
      {/* Header组件 - 固定高度40px */}
      <div className="flex-shrink-0">
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
      </div>
      
      {/* Content组件 - 占据剩余空间，减去Header(40px)和Footer(24px)的高度 */}
      <div className="flex-1 overflow-hidden">
        <Content
            url={url}
            width={size.width}
            height={size.height - 64} // 减去Header(40px)和Footer(24px)的高度
            themeStyles={themeStyles}
            currentPosition={currentPosition}
            onWidthResize={handleResize}
          />
      </div>
      
      {/* Footer组件 - 固定高度24px */}
      <div className="flex-shrink-0">
        <Footer
            width={size.width}
            height={size.height}
            themeStyles={themeStyles}
            onHeightResize={handleResize}
            onCornerResize={handleResize}
          />
      </div>
    </div>
  );

  // 使用Portal渲染到body
  return createPortal(floatingWindow, document.body);
};

export default FloatingPreview;