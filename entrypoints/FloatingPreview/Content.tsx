import React, { useEffect, useRef, useState } from 'react';
import { ThemeStyles, ContentProps } from '../../types/floating-preview';
import './styles.css';

// Content组件 - 悬浮窗内容区域，纯iframe容器
const Content: React.FC<ContentProps> = ({
  url,
  width,
  height,
  themeStyles,
  loading: externalLoading,
  onLoadingChange,
}) => {
  const [internalLoading, setInternalLoading] = useState(true); // 内部加载状态
  const [error, setError] = useState(false); // 错误状态
  // 新增：加载超时兜底定时器
  const loadTimeoutRef = useRef<number | null>(null);
  
  // 使用外部loading状态或内部loading状态
  const loading = externalLoading !== undefined ? externalLoading : internalLoading;

  // 辅助：规范化比较URL（忽略hash与尾部斜杠）
  const normalizeUrl = (u: string) => {
    try {
      const urlObj = new URL(u);
      urlObj.hash = '';
      let s = `${urlObj.origin}${urlObj.pathname}${urlObj.search}`;
      return s.endsWith('/') ? s.slice(0, -1) : s;
    } catch {
      return u.replace(/#.*$/, '').replace(/\/$/, '');
    }
  };

  // 处理iframe加载完成：只忽略 about:blank，其余都视为加载完成
  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    const loadedSrc = (e.currentTarget as HTMLIFrameElement).src || '';
    // 跳过空白页加载事件（例如刷新时先置空src再恢复）
    if (!loadedSrc || loadedSrc === 'about:blank') {
      return;
    }
    // 新增：清理加载超时兜底定时器
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
    setInternalLoading(false);
    setError(false);
    if (onLoadingChange) {
      onLoadingChange(false);
    }
  };

  // 处理iframe加载错误
  const handleIframeError = () => {
    // 新增：清理加载超时兜底定时器
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
    setInternalLoading(false);
    setError(true);
    // 通知父组件加载完成（即使是错误）
    if (onLoadingChange) {
      onLoadingChange(false);
    }
  };

  // 当URL变化时，重置加载状态
  useEffect(() => {
    setInternalLoading(true);
    setError(false);
    // 通知父组件开始加载
    if (onLoadingChange) {
      onLoadingChange(true);
    }
  }, [url, onLoadingChange]);

  // 新增：当 loading 为 true 时，启动加载超时兜底（8秒）
  useEffect(() => {
    // 每次 loading 或 URL 变化时重置定时器
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }

    if (loading) {
      loadTimeoutRef.current = window.setTimeout(() => {
        // 超时后自动结束 loading，防止动画卡住
        setInternalLoading(false);
        setError(false);
        if (onLoadingChange) {
          onLoadingChange(false);
        }
        loadTimeoutRef.current = null;
      }, 8000);
    }

    // 卸载或依赖变化时清理
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, [loading, url, onLoadingChange]);

  return (
    <div className={`floating-preview-content ${themeStyles.backgroundColor} ${themeStyles.textColor}`}>
      {loading && (
        <div className="floating-preview-loading">
          <div className="floating-preview-shark-container">
            <svg className="floating-preview-shark" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
              {/* 鲨鱼身体主体 */}
              <path 
                className="shark-body" 
                d="M15,20 Q25,10 45,15 Q65,18 75,20 Q65,22 45,25 Q25,30 15,20 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* 鲨鱼尾巴 */}
              <path 
                className="shark-tail" 
                d="M10,20 L5,15 L8,20 L5,25 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* 鲨鱼背鳍 */}
              <path 
                className="shark-fin" 
                d="M35,15 L40,8 L45,15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* 鲨鱼眼睛 */}
              <circle 
                className="shark-eye" 
                cx="55" 
                cy="18" 
                r="2"
                fill="currentColor"
              />
              {/* 水波纹效果 */}
              <path 
                className="water-wave" 
                d="M80,25 Q85,23 90,25 Q95,27 100,25"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
            <div className="floating-preview-loading-text">游泳中...</div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="floating-preview-error">
          <div className="floating-preview-error-text">加载失败: {error}</div>
        </div>
      )}
      
      <iframe
        src={url}
        className="floating-preview-iframe"
        style={{
          display: loading || error ? 'none' : 'block',
          backgroundColor: themeStyles.backgroundColor.includes('dark') ? '#1f2937' : '#ffffff'
        }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        title="预览内容"
      />
    </div>
  );
};

export default Content;
