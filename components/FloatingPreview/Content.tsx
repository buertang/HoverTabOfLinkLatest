import React, { useState } from "react";
import { ContentProps } from "../../types/floating-preview";

// Content组件 - 悬浮窗中部内容区
const Content: React.FC<ContentProps> = ({
  url,
  width,
  height,
  themeStyles,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      style={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: themeStyles.backgroundColor,
      }}
    >
      {/* 加载状态 */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "16px",
            color: themeStyles.textColor,
            opacity: 0.6,
          }}
        >
          正在加载...
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "14px",
            color: "#dc3545",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <div>无法加载此页面</div>
          <div style={{ fontSize: "12px", marginTop: "8px", opacity: 0.8 }}>
            可能由于X-Frame-Options限制或网络问题
          </div>
          <div style={{ fontSize: "12px", marginTop: "4px", opacity: 0.6 }}>
            请点击Header中的"在新标签页打开"按钮访问
          </div>
        </div>
      )}

      {/* iframe内容 */}
      <iframe
        src={url}
        style={{
          width: "100%",
          height: "100%",
          border: "0",
          borderRadius: "0.25rem",
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
