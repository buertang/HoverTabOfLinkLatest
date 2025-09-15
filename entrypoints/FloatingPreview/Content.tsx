import React, { useEffect, useRef, useState } from 'react';
import { ThemeStyles, ContentProps } from '../../types/floating-preview';
import './styles.css';

// Content组件 - 悬浮窗内容区域，纯iframe容器
const Content: React.FC<ContentProps> = ({
  url,
  width,
  height,
  themeStyles,
}) => {
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(false); // 错误状态

  // 处理iframe加载完成
  const handleIframeLoad = () => {
    setLoading(false);
    setError(false);
  };

  // 处理iframe加载错误
  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div className={`floating-preview-content ${themeStyles.backgroundColor} ${themeStyles.textColor}`}>
      {loading && (
        <div className="floating-preview-loading">
          <div className="floating-preview-loading-text">加载中...</div>
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
