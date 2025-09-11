import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface DelaySliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export function DelaySlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 50,
  unit = "ms",
}: DelaySliderProps) {
  // 使用内部状态在拖拽时即时显示数值，但不立刻保存
  const [internalValue, setInternalValue] = React.useState(value)
  // 当外部值变化（例如加载或重置设置）时，同步到内部状态
  React.useEffect(() => {
    setInternalValue(value)
  }, [value])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold text-foreground">
          {label}
        </Label>
        <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
          {internalValue}
          {unit}
        </span>
      </div>
      <div className="space-y-3">
        <Slider
          value={[internalValue]}
          // 拖拽时仅更新内部值，不触发保存
          onValueChange={([newValue]) => setInternalValue(newValue)}
          // 松开鼠标/触控结束时再提交保存
          onValueCommit={([commitValue]) => onChange(commitValue)}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          <span>
            {min}
            {unit}
          </span>
          <span>
            {max}
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}
