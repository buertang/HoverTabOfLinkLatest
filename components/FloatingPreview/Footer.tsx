import React, { useState, useRef, useEffect } from 'react';
import { ThemeStyles, FooterProps } from '../../types/floating-preview';

// Footer组件 - 悬浮窗底部
const Footer: React.FC<FooterProps> = ({
  width,
  height,
  themeStyles,
  onHeightResize,
  onCornerResize
}) => {
  // 调整状态管理
  const [isResizingHeight, setIsResizingHeight] = useState(false);
  const [isResizingCornerLeft, setIsResizingCornerLeft] = useState(false);
  const [isResizingCornerRight, setIsResizingCornerRight] = useState(false);
  
  // 调整起始状态记录
  const resizeStartRef = useRef<{
    startY: number;
    startX: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);
  
  // 处理高度调整开始
  const handleHeightResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingHeight(true);
    resizeStartRef.current = {
      startY: e.clientY,
      startX: e.clientX,
      startWidth: width,
      startHeight: height
    };
  };
  
  // 处理左下角调整开始
  const handleCornerLeftResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingCornerLeft(true);
    resizeStartRef.current = {
      startY: e.clientY,
      startX: e.clientX,
      startWidth: width,
      startHeight: height
    };
  };
  
  // 处理右下角调整开始
  const handleCornerRightResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingCornerRight(true);
    resizeStartRef.current = {
      startY: e.clientY,
      startX: e.clientX,
      startWidth: width,
      startHeight: height
    };
  };
  
  // 处理调整移动
  const handleResizeMove = (e: MouseEvent) => {
    if (!resizeStartRef.current) return;
    
    const deltaY = e.clientY - resizeStartRef.current.startY;
    const deltaX = e.clientX - resizeStartRef.current.startX;
    
    if (isResizingHeight) {
      // 仅调整高度
      const newHeight = Math.max(200, Math.min(
        resizeStartRef.current.startHeight + deltaY,
        window.innerHeight - 100
      ));
      onHeightResize({ height: newHeight });
      
    } else if (isResizingCornerLeft) {
      // 左下角：调整宽度和高度（宽度向左增加）
      const newWidth = Math.max(300, Math.min(
        resizeStartRef.current.startWidth - deltaX,
        window.innerWidth - 100
      ));
      const newHeight = Math.max(200, Math.min(
        resizeStartRef.current.startHeight + deltaY,
        window.innerHeight - 100
      ));
      onCornerResize({ width: newWidth, height: newHeight });
      
    } else if (isResizingCornerRight) {
      // 右下角：调整宽度和高度（宽度向右增加）
      const newWidth = Math.max(300, Math.min(
        resizeStartRef.current.startWidth + deltaX,
        window.innerWidth - 100
      ));
      const newHeight = Math.max(200, Math.min(
        resizeStartRef.current.startHeight + deltaY,
        window.innerHeight - 100
      ));
      onCornerResize({ width: newWidth, height: newHeight });
    }
  };
  
  // 处理调整结束
  const handleResizeEnd = () => {
    setIsResizingHeight(false);
    setIsResizingCornerLeft(false);
    setIsResizingCornerRight(false);
    resizeStartRef.current = null;
  };
  
  // 监听全局鼠标事件
  useEffect(() => {
    if (isResizingHeight || isResizingCornerLeft || isResizingCornerRight) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizingHeight, isResizingCornerLeft, isResizingCornerRight]);
  
  return (
    <div
      style={{
        position: 'relative',
        width: `${width}px`,
        height: '8px',
        backgroundColor: themeStyles.headerBg,
        borderTop: `1px solid ${themeStyles.borderColor}`
      }}
    >
      {/* 左下角调整把手 */}
      <div
        style={{
          position: 'absolute',
          left: '0',
          bottom: '0',
          width: '12px',
          height: '12px',
          cursor: 'nesw-resize',
          backgroundColor: themeStyles.borderColor,
          opacity: 0.6,
          borderRadius: '0 0 0 4px'
        }}
        onMouseDown={handleCornerLeftResizeStart}
        title="拖拽等比缩放"
      />
      
      {/* 中间高度调整把手 */}
      <div
        style={{
          position: 'absolute',
          left: '12px',
          right: '12px',
          top: '0',
          height: '8px',
          cursor: 'ns-resize',
          backgroundColor: 'transparent',
          borderTop: `3px solid ${themeStyles.borderColor}`,
          opacity: 0.4
        }}
        onMouseDown={handleHeightResizeStart}
        title="拖拽调整高度"
      />
      
      {/* 右下角调整把手 */}
      <div
        style={{
          position: 'absolute',
          right: '0',
          bottom: '0',
          width: '12px',
          height: '12px',
          cursor: 'nwse-resize',
          backgroundColor: themeStyles.borderColor,
          opacity: 0.6,
          borderRadius: '0 0 4px 0'
        }}
        onMouseDown={handleCornerRightResizeStart}
        title="拖拽等比缩放"
      />
    </div>
  );
};

export default Footer;