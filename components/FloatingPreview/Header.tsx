import React from 'react';
import { Pin, RotateCcw, ExternalLink, X } from 'lucide-react';
import { ThemeStyles, HeaderProps } from '../../types/floating-preview';

// Header组件 - 悬浮窗顶部
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
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        backgroundColor: themeStyles.headerBg,
        borderBottom: `1px solid ${themeStyles.borderColor}`,
        cursor: 'grab',
        userSelect: 'none',
        color: themeStyles.textColor
      }}
    >
      {/* 网址显示区 - 可拖拽区域 */}
      <div 
        className="flex-1 cursor-move select-none"
        onMouseDown={onDragStart}
      >
        <div 
          onClick={handleUrlClick}
          title={url}
          style={{
            fontSize: '14px',
            color: themeStyles.textColor,
            opacity: 0.8,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '300px'
          }}
        >
          {getDisplayUrl(url)}
        </div>
      </div>
      
      {/* 操作按钮区 */}
      <div className="flex items-center space-x-2 ml-4">
        {/* 固定按钮 */}
        <button
          onClick={onTogglePin}
          title={isPinned ? '取消固定' : '固定窗口'}
          style={{
            padding: '4px 8px',
            margin: '0 2px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '14px',
            color: themeStyles.textColor
          }}
        >
          <Pin size={16} className={isPinned ? 'fill-current' : ''} />
        </button>
        
        {/* 刷新按钮 */}
        <button
           onClick={onRefresh}
           title="刷新页面"
           style={{
             padding: '4px 8px',
             margin: '0 2px',
             border: 'none',
             borderRadius: '4px',
             backgroundColor: 'transparent',
             cursor: 'pointer',
             fontSize: '14px',
             color: themeStyles.textColor
           }}
         >
           <RotateCcw size={16} />
         </button>
         
         <button
           onClick={onOpenInNewTab}
           title="在新标签页打开"
           style={{
             padding: '4px 8px',
             margin: '0 2px',
             border: 'none',
             borderRadius: '4px',
             backgroundColor: 'transparent',
             cursor: 'pointer',
             fontSize: '14px',
             color: themeStyles.textColor
           }}
         >
           <ExternalLink size={16} />
         </button>
         
         <button
           onClick={onClose}
           title="关闭"
           style={{
             padding: '4px 8px',
             margin: '0 2px',
             border: 'none',
             borderRadius: '4px',
             backgroundColor: 'transparent',
             cursor: 'pointer',
             fontSize: '14px',
             color: themeStyles.textColor
           }}
         >
           <X size={16} />
         </button>
      </div>
    </div>
  );
};

export default Header;