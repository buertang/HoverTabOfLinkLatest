import React, { useState } from 'react';
import { Pin, RotateCcw, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeStyles, HeaderProps } from '../../types/floating-preview';

// Header组件 - 悬浮窗顶部，使用TailwindCSS和shadcn/ui重写
const Header: React.FC<HeaderProps> = ({
  url,
  isPinned,
  themeStyles,
  onTogglePin,
  onRefresh,
  onOpenInNewTab,
  onClose,
  onDragStart
}) => {
  // 拖拽状态管理
  const [isDragHover, setIsDragHover] = useState(false);
  // 处理URL点击 - 在新标签页打开
  const handleUrlClick = () => {
    window.open(url, '_blank');
  };
  
  // 截取显示的URL（如果太长则显示省略号）
  const getDisplayUrl = (url: string) => {
    if (url.length <= 50) return url;
    return url.substring(0, 47) + '...';
  };
  
  return (
    <div 
      className={`flex items-center justify-between px-3 py-2 ${themeStyles.headerBg} border-b ${themeStyles.border} cursor-grab select-none ${themeStyles.textColor}`}
    >
      {/* 网址显示区 - 可拖拽区域 */}
      <div 
        className={`flex-1 cursor-move select-none rounded px-2 py-1 transition-all duration-150 ease-out ${isDragHover ? 'bg-blue-400 bg-opacity-15' : 'hover:bg-gray-400 hover:bg-opacity-10'}`}
        onMouseDown={(e) => {
          setIsDragHover(true);
          onDragStart(e);
        }}
        onMouseUp={() => setIsDragHover(false)}
        onMouseLeave={() => setIsDragHover(false)}
        style={{
          // 添加硬件加速
          transform: 'translateZ(0)',
          willChange: isDragHover ? 'background-color' : 'auto'
        }}
      >
        <div 
          onClick={handleUrlClick}
          title={url}
          className={`text-sm ${themeStyles.textColor} opacity-80 overflow-hidden text-ellipsis whitespace-nowrap max-w-xs hover:opacity-100 cursor-pointer transition-all duration-150`}
        >
          {getDisplayUrl(url)}
        </div>
      </div>
      
      {/* 操作按钮区 */}
      <div className="flex items-center space-x-1 ml-4">
        {/* 固定按钮 - 使用shadcn/ui Button组件 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onTogglePin}
          title={isPinned ? '取消固定' : '固定窗口'}
          className={`h-8 w-8 p-0 hover:bg-opacity-20 ${themeStyles.textColor}`}
        >
          <Pin 
            size={16} 
            className={`${isPinned ? 'fill-current' : ''} transition-all`} 
          />
        </Button>
        
        {/* 刷新按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          title="刷新页面"
          className={`h-8 w-8 p-0 hover:bg-opacity-20 ${themeStyles.textColor}`}
        >
          <RotateCcw size={16} className="transition-transform hover:rotate-180 duration-300" />
        </Button>
         
        {/* 新标签页打开按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenInNewTab}
          title="在新标签页打开"
          className={`h-8 w-8 p-0 hover:bg-opacity-20 ${themeStyles.textColor}`}
        >
          <ExternalLink size={16} className="transition-transform hover:scale-110" />
        </Button>
         
        {/* 关闭按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          title="关闭"
          className={`h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 ${themeStyles.textColor} transition-colors`}
        >
          <X size={16} className="transition-transform hover:scale-110" />
        </Button>
      </div>
    </div>
  );
};

export default Header;