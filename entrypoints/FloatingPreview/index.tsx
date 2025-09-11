import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import Header from "./Header";
import Content from "./Content";

import {
  ThemeStyles,
  FloatingPreviewProps,
} from "../../types/floating-preview";

// 优化的Header组件 - 使用React.memo避免不必要的重渲染
const MemoizedHeader = React.memo(Header);
const MemoizedContent = React.memo(Content);

// 悬浮窗组件 - 性能优化版本
const FloatingPreview: React.FC<FloatingPreviewProps> = ({
  url,
  settings,
  mousePosition,
  initialPosition,
  onClose,
  windowId,
}) => {
  // 悬浮窗状态管理
  const [position, setPosition] = useState(() => {
    // 弹窗在容器中居中显示，由于容器已经通过CSS居中，这里设置为0
    return { x: 0, y: 0 };
  });
  const [size, setSize] = useState({
    width: settings.width,
    height: settings.height,
  });
  const [isPinned, setIsPinned] = useState(() => Boolean(settings.autoPin)); // 是否固定窗口
  const [isDragging, setIsDragging] = useState(false); // 是否正在拖拽
  const [isResizing, setIsResizing] = useState(false); // 是否正在调整大小
  const [isFollowingMouse, setIsFollowingMouse] = useState(true); // 是否跟随鼠标
  const [showOverlay, setShowOverlay] = useState(false); // 是否显示遮罩层
  // 新增：是否鼠标在悬浮窗内，用于 ESC 关闭判断
  const [isMouseInside, setIsMouseInside] = useState(false);

  // 最小尺寸限制（可根据产品需要再调整）
  const MIN_WIDTH = 320; // 最小宽度
  const MIN_HEIGHT = 240; // 最小高度

  // 新增：由Header动态回传的最小宽度（按钮区 + 地址区最小展示），保证按钮始终可见
  const [headerMinWidth, setHeaderMinWidth] = useState<number>(MIN_WIDTH);

  // 高性能拖拽实现 - 使用ref避免setState触发重渲染
  const currentTransformRef = useRef({ x: 0, y: 0 }); // 当前transform位置
  const animationFrameRef = useRef<number | null>(null); // RAF引用

  // 防抖定时器引用
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // DOM引用
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  // 新增：缩放起始信息的引用，支持 bottom-right
  const resizeStartRef = useRef<{
    edge: "bottom-left" | "bottom-right";
    mouseX: number;
    mouseY: number;
    startWidth: number;
    startHeight: number;
    startX: number;
    startY: number;
  } | null>(null);
  // 新增：缩放期间使用的RAF，避免频繁setState造成卡顿
  const resizeRafRef = useRef<number | null>(null);
  // 保持 handleResize 的最新引用
  const handleResizeRef =
    useRef<
      (
        newSize: { width?: number; height?: number },
        positionChange?: { x?: number; y?: number }
      ) => void | null
    >(null);
  // 新增：指针捕获ID与元素引用，确保快速拖拽不丢事件
  const activePointerIdRef = useRef<number | null>(null);
  const pointerCaptureElRef = useRef<HTMLElement | null>(null);

  // 首次定位状态与最近一次应用的 initialPosition
  const initialPositionAppliedRef = useRef(false);
  const lastAppliedInitialRef = useRef<{ x: number; y: number } | null>(null);

  // 根据 props.initialPosition 或 settings.position 计算并应用固定位置
  useEffect(() => {
    const margin = 16;

    // 如果提供了绝对初始位置，则优先使用，并在变化时更新
    if (initialPosition && !isDragging && !isResizing) {
      // 若尺寸变化，需要重新校正边界
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const targetX = Math.max(
        margin,
        Math.min(vw - size.width - margin, initialPosition.x)
      );
      const targetY = Math.max(
        margin,
        Math.min(vh - size.height - margin, initialPosition.y)
      );
      const changed =
        !lastAppliedInitialRef.current ||
        lastAppliedInitialRef.current.x !== targetX ||
        lastAppliedInitialRef.current.y !== targetY;
      if (changed) {
        setIsFollowingMouse(false);
        // 直接更新到 DOM 与状态，避免引用尚未声明的 updatePosition
        if (containerRef.current) {
          containerRef.current.style.left = `${targetX}px`;
          containerRef.current.style.top = `${targetY}px`;
        }
        currentTransformRef.current = { x: targetX, y: targetY };
        setPosition({ x: targetX, y: targetY });
        lastAppliedInitialRef.current = { x: targetX, y: targetY };
        initialPositionAppliedRef.current = true;
      }
      return; // 不再执行 settings.position 分支
    }

    // 若未提供 initialPosition，且尚未应用过初始定位，则按 settings.position 初始化一次
    if (initialPositionAppliedRef.current) return;

    const pos = settings.position;
    if (
      pos === "center" ||
      pos === "top-right" ||
      pos === "top-left" ||
      pos === "bottom-right" ||
      pos === "bottom-left"
    ) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = 0;
      let y = 0;
      if (pos === "center") {
        x = Math.max((vw - size.width) / 2, margin);
        y = Math.max((vh - size.height) / 2, margin);
      } else if (pos === "top-right") {
        x = Math.max(vw - size.width - margin, margin);
        y = margin;
      } else if (pos === "top-left") {
        x = margin;
        y = margin;
      } else if (pos === "bottom-right") {
        x = Math.max(vw - size.width - margin, margin);
        y = Math.max(vh - size.height - margin, margin);
      } else if (pos === "bottom-left") {
        x = margin;
        y = Math.max(vh - size.height - margin, margin);
      }
      setIsFollowingMouse(false);
      // 直接更新到 DOM 与状态
      if (containerRef.current) {
        containerRef.current.style.left = `${x}px`;
        containerRef.current.style.top = `${y}px`;
      }
      currentTransformRef.current = { x, y };
      setPosition({ x, y });
      initialPositionAppliedRef.current = true;
    } else {
      // 默认跟随鼠标
      setIsFollowingMouse(true);
      initialPositionAppliedRef.current = true;
    }
  }, [
    initialPosition,
    settings.position,
    size.width,
    size.height,
    isDragging,
    isResizing,
  ]);

  // 计算弹窗位置（跟随鼠标或拖拽位置）- 使用useCallback稳定引用
  const calculatePosition = useCallback(() => {
    if (!isFollowingMouse || isDragging) {
      // 如果不跟随鼠标或正在拖拽，使用当前position
      return position;
    }

    if (mousePosition) {
      // 跟随鼠标，添加偏移避免遮挡鼠标
      const offset = 20;
      let x = mousePosition.x + offset;
      let y = mousePosition.y + offset;

      return { x, y };
    }

    return position;
  }, [isFollowingMouse, isDragging, position, mousePosition]);

  // 根据主题获取样式类名 - 使用useCallback避免重复计算
  const getThemeStyles = useCallback((theme: "light" | "dark"): ThemeStyles => {
    if (theme === "dark") {
      return {
        backgroundColor: "bg-gray-900",
        borderColor: "border-gray-700",
        textColor: "text-white",
        headerBg: "bg-gray-800",
        border: "border-gray-700",
        bg: "bg-gray-900",
      };
    }
    return {
      backgroundColor: "bg-white",
      borderColor: "border-gray-300",
      textColor: "text-gray-900",
      headerBg: "bg-gray-50",
      border: "border-gray-300",
      bg: "bg-white",
    };
  }, []);

  const themeStyles = useMemo(
    () => getThemeStyles(settings.theme),
    [getThemeStyles, settings.theme]
  );
  // 根据主题选择更合适的手柄颜色（浅色用天蓝，深色用青色），并复用
  const handleColor = useMemo(
    () => (settings.theme === "dark" ? "#22d3ee" : "#38bdf8"),
    [settings.theme]
  );

  // 高性能位置更新函数 - 直接操作DOM left/top，避免React重渲染
  const updatePosition = useCallback((x: number, y: number) => {
    if (containerRef.current) {
      // 直接设置left和top属性，避免transform导致的抖动
      containerRef.current.style.left = `${x}px`;
      containerRef.current.style.top = `${y}px`;
      currentTransformRef.current = { x, y };
    }
  }, []);

  // 处理拖拽开始 - 优化版本
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (isResizing) return;

      setIsDragging(true);
      setIsFollowingMouse(false); // 开始拖拽时停止跟随鼠标
      setShowOverlay(true); // 拖拽开始时确保遮罩显示

      // 获取当前实际位置（考虑transform）
      const currentPos =
        currentTransformRef.current.x !== 0 ||
        currentTransformRef.current.y !== 0
          ? currentTransformRef.current
          : calculatePosition();

      dragStartRef.current = {
        x: e.clientX - currentPos.x,
        y: e.clientY - currentPos.y,
      };

      // 拖拽时禁用iframe的pointer-events，提升性能
      const iframe = containerRef.current?.querySelector("iframe");
      if (iframe) {
        (iframe as HTMLElement).style.pointerEvents = "none";
      }
    },
    [isResizing, calculatePosition]
  );

  // 处理拖拽结束 - 优化版本
  const handleDragEnd = useCallback((e?: MouseEvent) => {
    setIsDragging(false);
    dragStartRef.current = null;

    // 恢复iframe的pointer-events
    const iframe = containerRef.current?.querySelector("iframe");
    if (iframe) {
      (iframe as HTMLElement).style.pointerEvents = "auto";
    }

    // 同步transform位置到React state（为了其他逻辑的一致性）
    setPosition({
      x: currentTransformRef.current.x,
      y: currentTransformRef.current.y,
    });

    // 清除可能存在的防抖定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // 添加短暂延迟，确保拖拽状态完全结束后再处理遮罩
    debounceTimerRef.current = setTimeout(() => {
      // 拖拽结束后，检查鼠标是否仍在悬浮窗上
      if (e && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isMouseOverWindow =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        // 只有确认鼠标不在悬浮窗上时才隐藏遮罩
        if (!isMouseOverWindow) {
          setShowOverlay(false);
        }
      }
      debounceTimerRef.current = null;
    }, 150); // 150ms延迟，确保状态稳定
  }, []);

  // 开始缩放 - 根据边缘类型处理（改为Pointer Events并启用指针捕获）
  const startResize = useCallback(
    (edge: "bottom-left" | "bottom-right") => (e: React.PointerEvent) => {
      e.stopPropagation(); // 避免触发拖拽
      // 记录指针ID并捕获，确保快速拖拽不丢事件
      const el = e.currentTarget as HTMLElement;
      const pid = e.pointerId;
      activePointerIdRef.current = pid;
      pointerCaptureElRef.current = el;
      try {
        el.setPointerCapture(pid);
      } catch {}

      setIsResizing(true);
      setIsFollowingMouse(false);
      setShowOverlay(true);

      // 记录起始数据
      resizeStartRef.current = {
        edge,
        mouseX: e.clientX,
        mouseY: e.clientY,
        startWidth: size.width,
        startHeight: size.height,
        startX: currentTransformRef.current.x,
        startY: currentTransformRef.current.y,
      };

      // 缩放时禁用iframe事件，避免抢占
      const iframe = containerRef.current?.querySelector("iframe");
      if (iframe) {
        (iframe as HTMLElement).style.pointerEvents = "none";
      }

      const onMove = (ev: PointerEvent) => {
        // 仅处理当前活动指针
        if (
          activePointerIdRef.current !== null &&
          ev.pointerId !== activePointerIdRef.current
        )
          return;
        if (!resizeStartRef.current) return;
        const dx = ev.clientX - resizeStartRef.current.mouseX; // 指针X位移
        const dy = ev.clientY - resizeStartRef.current.mouseY; // 指针Y位移

        let newWidth = resizeStartRef.current.startWidth;
        let newHeight = resizeStartRef.current.startHeight;
        let newX = resizeStartRef.current.startX;
        let newY = resizeStartRef.current.startY;

        // 动态最小宽度，确保按钮区域始终可见
        const effectiveMinWidth = Math.max(MIN_WIDTH, headerMinWidth);

        switch (resizeStartRef.current.edge) {
          case "bottom-left": {
            // 左下角：以"右上角"为锚点，保持右缘与上缘固定
            const startRight =
              resizeStartRef.current.startX + resizeStartRef.current.startWidth; // 固定的右缘
            // 向右拖动(dx>0) => 变窄；向左拖动(dx<0) => 变宽
            const widthRaw = resizeStartRef.current.startWidth - dx;
            newWidth = Math.max(effectiveMinWidth, widthRaw);
            newX = startRight - newWidth; // 右缘固定 => 左缘 = 右缘 - 宽度
            newY = resizeStartRef.current.startY; // 上缘固定
            newHeight = Math.max(
              MIN_HEIGHT,
              resizeStartRef.current.startHeight + dy
            );
            break;
          }
          case "bottom-right": {
            // 右下角：左侧固定
            newWidth = Math.max(
              effectiveMinWidth,
              resizeStartRef.current.startWidth + dx
            );
            newHeight = Math.max(
              MIN_HEIGHT,
              resizeStartRef.current.startHeight + dy
            );
            break;
          }
        }

        // 使用RAF进行节流：仅当当前未排队时入队，避免频繁cancel造成的抖动
        if (!resizeRafRef.current) {
          // 捕获当前帧的计算结果
          const capturedWidth = newWidth;
          const capturedHeight = newHeight;
          const capturedX = newX;
          const capturedY = newY;

          resizeRafRef.current = requestAnimationFrame(() => {
            if (!resizeStartRef.current) return;

            // 原子性更新：先更新DOM位置和尺寸，再更新React state
            if (resizeStartRef.current.edge === "bottom-left") {
              // 同时更新位置和尺寸，避免分步更新导致的重排
              if (containerRef.current) {
                containerRef.current.style.left = `${capturedX}px`;
                containerRef.current.style.top = `${capturedY}px`;
                containerRef.current.style.width = `${capturedWidth}px`;
                containerRef.current.style.height = `${capturedHeight}px`;
                currentTransformRef.current = { x: capturedX, y: capturedY };
              }
            } else {
              // 非左下角拖拽只更新尺寸
              if (containerRef.current) {
                containerRef.current.style.width = `${capturedWidth}px`;
                containerRef.current.style.height = `${capturedHeight}px`;
              }
            }

            // 最后同步React state，确保一致性
            setSize({ width: capturedWidth, height: capturedHeight });

            resizeRafRef.current = null; // 释放队列占用
          });
        }
      };

      const finishResize = (ev?: PointerEvent) => {
        document.removeEventListener("pointermove", onMove as any);
        document.removeEventListener("pointerup", finishResize as any);
        document.removeEventListener("pointercancel", finishResize as any);

        setIsResizing(false);

        if (resizeRafRef.current) {
          cancelAnimationFrame(resizeRafRef.current);
          resizeRafRef.current = null;
        }

        // 释放指针捕获
        if (
          pointerCaptureElRef.current &&
          activePointerIdRef.current !== null
        ) {
          try {
            pointerCaptureElRef.current.releasePointerCapture(
              activePointerIdRef.current
            );
          } catch {}
        }
        activePointerIdRef.current = null;
        pointerCaptureElRef.current = null;

        // 恢复iframe事件
        const iframe = containerRef.current?.querySelector("iframe");
        if (iframe) {
          (iframe as HTMLElement).style.pointerEvents = "auto";
        }

        // 同步最终位置
        setPosition({
          x: currentTransformRef.current.x,
          y: currentTransformRef.current.y,
        });

        // 根据指针位置决定是否隐藏遮罩
        if (containerRef.current && ev) {
          const rect = containerRef.current.getBoundingClientRect();
          const inWindow =
            ev.clientX >= rect.left &&
            ev.clientX <= rect.right &&
            ev.clientY >= rect.top &&
            ev.clientY <= rect.bottom;
          if (!inWindow) setShowOverlay(false);
        }

        // 清理状态
        resizeStartRef.current = null;

        // 持久化最新尺寸到本地存储，供下次打开使用
        try {
          browser.storage.local.set({
            floatingPreviewLastSize: { width: size.width, height: size.height },
          });
        } catch {}
      };

      document.addEventListener("pointermove", onMove as any, {
        passive: true,
      });
      document.addEventListener("pointerup", finishResize as any);
      document.addEventListener("pointercancel", finishResize as any);
    },
    [size.width, size.height, headerMinWidth]
  );

  // 处理尺寸变化 - 优化响应性能，直接更新状态
  const handleResize = useCallback(
    (
      newSize: { width?: number; height?: number },
      positionChange?: { x?: number; y?: number }
    ) => {
      // 直接更新尺寸
      setSize((prev) => ({
        width: newSize.width ?? prev.width,
        height: newSize.height ?? prev.height,
      }));

      // 如果有位置变化，使用高性能更新
      if (positionChange) {
        const newX = positionChange.x ?? currentTransformRef.current.x;
        const newY = positionChange.y ?? currentTransformRef.current.y;
        updatePosition(newX, newY);
        setPosition({ x: newX, y: newY });
      }
    },
    [updatePosition]
  );

  // 将最新的 handleResize 保存在 ref 中，供缩放逻辑安全调用
  useEffect(() => {
    handleResizeRef.current = handleResize;
  }, [handleResize]);

  // 处理固定状态切换
  const handleTogglePin = useCallback(() => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    if (newPinned) {
      // 固定时停止跟随鼠标，保存当前transform位置
      setIsFollowingMouse(false);
      setPosition({
        x: currentTransformRef.current.x,
        y: currentTransformRef.current.y,
      });
    } else {
      // 取消固定时恢复跟随鼠标
      setIsFollowingMouse(true);
    }
  }, [isPinned]);

  // 处理在新标签页打开
  const handleOpenInNewTab = useCallback(() => {
    window.open(url, "_blank");
  }, [url]);

  // 处理刷新
  const handleRefresh = useCallback(() => {
    // 通过重新设置iframe的src来刷新
    const iframe = containerRef.current?.querySelector("iframe");
    if (iframe) {
      const currentSrc = iframe.src;
      iframe.src = "";
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 100);
    }
  }, []);

  // 高性能拖拽移动处理 - 使用RAF批量更新
  useEffect(() => {
    if (isDragging) {
      const handleHighPerformanceMouseMove = (e: MouseEvent) => {
        // 取消之前的RAF
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        // 使用RAF批量处理位置更新
        animationFrameRef.current = requestAnimationFrame(() => {
          if (dragStartRef.current) {
            const newX = e.clientX - dragStartRef.current.x;
            const newY = e.clientY - dragStartRef.current.y;

            // 直接更新transform，不触发React重渲染
            updatePosition(newX, newY);
          }
        });
      };

      const handleDragEndWithEvent = (e: MouseEvent) => {
        // 清理RAF
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        handleDragEnd(e);
      };

      // 使用passive监听器提升性能
      document.addEventListener("mousemove", handleHighPerformanceMouseMove, {
        passive: true,
      });
      document.addEventListener("mouseup", handleDragEndWithEvent);

      return () => {
        document.removeEventListener(
          "mousemove",
          handleHighPerformanceMouseMove
        );
        document.removeEventListener("mouseup", handleDragEndWithEvent);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isDragging, updatePosition, handleDragEnd]);

  // 清理资源
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isPinned) return;
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPinned, onClose]);

  // 使用useMemo缓存位置计算，减少重复计算
  const currentPosition = useMemo(
    () => calculatePosition(),
    [calculatePosition]
  );

  // 初始化transform位置
  useEffect(() => {
    if (
      !isDragging &&
      (currentTransformRef.current.x !== currentPosition.x ||
        currentTransformRef.current.y !== currentPosition.y)
    ) {
      updatePosition(currentPosition.x, currentPosition.y);
    }
  }, [currentPosition, isDragging, updatePosition]);

  // 处理鼠标进入悬浮窗 - 添加防抖机制
  const handleMouseEnter = useCallback(() => {
    // 清除之前的延迟隐藏定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    setShowOverlay(true);
    setIsMouseInside(true);
    // 让容器在鼠标进入时尝试获取焦点，从而在跨站 iframe 下也能捕获 ESC
    if (containerRef.current) {
      try {
        (containerRef.current as HTMLDivElement).focus({
          preventScroll: true,
        } as any);
      } catch {}
    }
  }, []);

  // 处理鼠标离开悬浮窗 - 优化拖拽时的遮罩状态，添加防抖机制
  const handleMouseLeave = useCallback(() => {
    // 如果正在拖拽，强制保持遮罩显示，避免闪烁
    if (isDragging) {
      return;
    }

    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 使用防抖机制，避免快速移动时的意外隐藏
    debounceTimerRef.current = setTimeout(() => {
      // 再次检查是否仍在拖拽状态
      if (!isDragging) {
        setShowOverlay(false);
        setIsMouseInside(false);
      }
      debounceTimerRef.current = null;
    }, 100); // 100ms延迟，提供稳定性
  }, [isDragging]);

  // 键盘 ESC 关闭（仅在固定且鼠标在窗体内）
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        if (isMouseInside) {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
      }
    };
    // 捕获阶段，优先于页面其他处理
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [isMouseInside, onClose]);

  // 渲染遮罩层 - 拖拽时移除blur效果，显著提升性能
  const overlayElement = showOverlay ? (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 999998, // 小于悬浮窗的z-index
        // 背景透明度与模糊程度反向关联：透明度100=完全透明无模糊，透明度0=完全不透明且模糊最高
        backgroundColor: "transparent",
        // 模糊程度随透明度线性递减：透明度0时模糊16px，透明度100时模糊0px
        backdropFilter:
          isDragging || isResizing
            ? "none"
            : `blur(${Math.max(
                0,
                (6 * (100 - settings.backgroundOpacity)) / 100
              )}px)`,
        WebkitBackdropFilter:
          isDragging || isResizing
            ? "none"
            : `blur(${Math.max(
                0,
                (6 * (100 - settings.backgroundOpacity)) / 100
              )}px)`,
        transition: "none",
      }}
    />
  ) : null;

  // 渲染悬浮窗 - 使用transform定位，优化性能
  const floatingWindow = (
    <>
      {overlayElement}
      <div
        ref={containerRef}
        id={`floating-preview-window-${windowId ?? 'default'}`}
        className={`fixed overflow-hidden z-[10000] ${themeStyles.backgroundColor} ${themeStyles.borderColor} border-2 flex flex-col`}
        tabIndex={-1}
        style={{
          width: size.width,
          height: size.height,
          minWidth: Math.max(MIN_WIDTH, headerMinWidth),
          minHeight: MIN_HEIGHT,
          // 直接使用left/top定位，避免transform导致的抖动
          top: currentPosition.y,
          left: currentPosition.x,
          cursor: isDragging ? "grabbing" : "default",
          opacity: settings.opacity,
          pointerEvents: "auto",
          zIndex: 999999,
          // 拖拽/缩放时移除阴影，减少重绘成本；圆角保持不变，避免样式跳变
          boxShadow:
            isDragging || isResizing
              ? "none"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          borderRadius: "0.5rem",
          // 优化过渡效果：拖拽或缩放时完全禁用过渡
          transition:
            isDragging || isResizing
              ? "none"
              : "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
          // 硬件加速优化：拖拽时left/top，缩放时width/height/left/top
          willChange: isDragging
            ? "left, top"
            : isResizing
            ? "width, height, left, top"
            : "auto",
          // 合成层隔离，降低布局影响面
          contain: "layout paint size",
          // 强制创建合成层
          backfaceVisibility: "hidden",
          perspective: "1000px",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header组件 - 固定高度40px */}
        <div className="flex-shrink-0">
          <MemoizedHeader
            url={url}
            isPinned={isPinned}
            themeStyles={themeStyles}
            onTogglePin={handleTogglePin}
            onRefresh={handleRefresh}
            onOpenInNewTab={handleOpenInNewTab}
            onClose={onClose}
            onDragStart={handleDragStart}
            // 新增：接收Header的最小宽度回传
            onHeaderMinWidthChange={(w) => {
              // 仅当值变化较大时更新，减少重排
              if (!Number.isFinite(w)) return;
              setHeaderMinWidth((prev) => (Math.abs(prev - w) > 1 ? w : prev));
            }}
          />
        </div>

        {/* Content组件 - 占据剩余空间，减去Header(40px)的高度 */}
        <div className="flex-1 overflow-hidden">
          <MemoizedContent
            url={url}
            width={size.width}
            height={size.height - 40} // 减去Header(40px)的高度
            themeStyles={themeStyles}
          />
        </div>

        {/* ==== 悬停时显示的可视化拉伸手柄（左、右、下、左下角、右下角）==== */}
        {(showOverlay || isResizing) &&
          (() => {
            const activeEdge = isResizing
              ? resizeStartRef.current?.edge
              : undefined;
            const inactiveOpacity = 0.5; // 非激活时半透明
            const activeOpacity = 0.95; // 激活时高亮
            return (
              <>
                {/* 左下角：小尺寸三角形（替代 1/4 圆） */}
                <div
                  className={`absolute left-0 bottom-0 cursor-nesw-resize transition-opacity duration-150`}
                  style={{
                    width: 22,
                    height: 22,
                    opacity:
                      activeEdge === "bottom-left"
                        ? activeOpacity
                        : inactiveOpacity,
                    userSelect: "none",
                    touchAction: "none", // 防止触控滚动干扰Pointer事件
                    backgroundColor: handleColor,
                    // 右角为直角，指向内侧
                    clipPath: "polygon(0 100%, 100% 100%, 0 0)",
                  }}
                  onPointerDown={startResize("bottom-left")}
                  aria-label="向左下角同时拉伸"
                />
                {/* 右下角：小尺寸三角形（替代 1/4 圆） */}
                <div
                  className={`absolute right-0 bottom-0 cursor-nwse-resize transition-opacity duration-150`}
                  style={{
                    width: 22,
                    height: 22,
                    opacity:
                      activeEdge === "bottom-right"
                        ? activeOpacity
                        : inactiveOpacity,
                    userSelect: "none",
                    touchAction: "none", // 防止触控滚动干扰Pointer事件
                    backgroundColor: handleColor,
                    clipPath: "polygon(0 100%, 100% 100%, 100% 0)",
                  }}
                  onPointerDown={startResize("bottom-right")}
                  aria-label="向右下角同时拉伸"
                />
              </>
            );
          })()}
      </div>
    </>
  );

  // 使用Portal渲染到body
  return createPortal(floatingWindow, document.body);
};

export default FloatingPreview;
