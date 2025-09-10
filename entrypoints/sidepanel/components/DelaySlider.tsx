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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold text-foreground">
          {label}
        </Label>
        <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
          {value}
          {unit}
        </span>
      </div>
      <div className="space-y-3">
        <Slider
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
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
