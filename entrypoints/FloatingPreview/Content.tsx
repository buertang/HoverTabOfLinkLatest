import React, { useState } from "react";
import { ThemeStyles, ContentProps } from "../../types/floating-preview";

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
    <div
      className={`relative ${themeStyles.bg}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* 加载状态 */}
      {loading && (
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base ${themeStyles.textColor} opacity-60`}
        >
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            <span>正在加载...</span>
          </div>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-5">
          <div className="text-red-500 text-sm mb-2">
            <div className="mb-2">⚠️ 无法加载此页面</div>
            <div className="text-xs opacity-80 mb-1">
              可能由于X-Frame-Options限制或网络问题
            </div>
            <div className="text-xs opacity-60">
              请点击Header中的"在新标签页打开"按钮访问
            </div>
          </div>
        </div>
      )}

      {/* iframe内容 */}
      <iframe
        src={url}
        className="w-full h-full border-0 rounded"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        title="预览内容"
      />
    </div>
  );
};

export default Content;
