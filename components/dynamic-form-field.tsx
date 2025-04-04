"use client"

import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import type { FormField as FormFieldType } from "@/types/form"
import { cn } from "@/lib/utils"

interface DynamicFormFieldProps {
  field: FormFieldType
  disabled?: boolean
}

export function DynamicFormField({ field, disabled = false }: DynamicFormFieldProps) {
  const { control, watch, setValue } = useFormContext()

  // Обработка зависимостей полей
  useEffect(() => {
    if (field.dependsOn) {
      const subscription = watch((value, { name }) => {
        if (name === field.dependsOn?.field) {
          // Если значение зависимого поля изменилось, проверяем условие
          const dependentValue = value[field.dependsOn.field]
          const shouldReset = field.dependsOn.value !== dependentValue

          if (shouldReset) {
            // Сбрасываем значение текущего поля
            setValue(field.name, field.type === "checkbox" ? false : "")
          }
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [field, watch, setValue])

  // Проверяем, должно ли поле быть видимым на основе зависимостей
  const dependentValue = field.dependsOn ? watch(field.dependsOn.field) : null
  const isVisible = !field.dependsOn || dependentValue === field.dependsOn.value

  if (!isVisible) {
    return null
  }

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className={cn(field.fullWidth ? "md:col-span-2" : "")}>
          <FormLabel>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>{renderFieldByType(field, formField, disabled)}</FormControl>
          {field.description && <p className="text-sm text-gray-500">{field.description}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function renderFieldByType(fieldConfig: FormFieldType, field: any, disabled: boolean) {
  switch (fieldConfig.type) {
    case "text":
      return <Input {...field} type="text" placeholder={fieldConfig.placeholder} disabled={disabled} />

    case "textarea":
      return (
        <Textarea {...field} placeholder={fieldConfig.placeholder} disabled={disabled} rows={fieldConfig.rows || 3} />
      )

    case "number":
      return (
        <Input
          {...field}
          type="number"
          placeholder={fieldConfig.placeholder}
          disabled={disabled}
          onChange={(e) => {
            const value = e.target.value === "" ? "" : Number(e.target.value)
            field.onChange(value)
          }}
        />
      )

    case "select":
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder={fieldConfig.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {fieldConfig.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case "date":
      return <Input {...field} type="date" disabled={disabled} />

    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={disabled} id={fieldConfig.name} />
          <Label htmlFor={fieldConfig.name} className="text-sm font-normal">
            {fieldConfig.checkboxLabel || fieldConfig.label}
          </Label>
        </div>
      )

    case "file":
      return (
        <Input
          type="file"
          disabled={disabled}
          onChange={(e) => {
            field.onChange(e.target.files?.[0] || null)
          }}
        />
      )

    default:
      return <Input {...field} disabled={disabled} />
  }
}

