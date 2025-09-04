import React from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SelectOption {
  value: string
  label: string
}

interface LabelSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  description?: string
  layout?: 'simple' | 'complex'
}

export function LabelSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  className = '',
  description,
  layout = 'simple'
}: LabelSelectProps) {
  // 简单模式：左侧标签，右侧选择器
  if (layout === 'simple') {
    return (
      <div className={`flex justify-between items-center ${className}`}>
        <Label className="text-base font-semibold text-foreground">{label}</Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  // 复杂模式：左侧标签+描述文本垂直排列，右侧选择器
  return (
    <div className={`flex justify-between items-center ${className}`}>
      <div className="space-y-0.5">
        <Label className="text-base font-semibold text-foreground">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}