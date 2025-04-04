"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DynamicFormField } from "@/components/dynamic-form-field"
import type { FormSchema } from "@/types/form"

interface ApplicationFormProps {
  schema: FormSchema
  initialData?: Record<string, any>
  readOnly?: boolean
  onSubmit?: (data: Record<string, any>) => void
  onSaveDraft?: (data: Record<string, any>) => void
}

export function ApplicationForm({
  schema,
  initialData = {},
  readOnly = false,
  onSubmit,
  onSaveDraft,
}: ApplicationFormProps) {
  // Создаем динамическую схему валидации на основе JSON-схемы
  const validationSchema = buildValidationSchema(schema)

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: initialData,
    mode: "onChange",
  })

  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods

  const submitHandler = (data: Record<string, any>) => {
    if (onSubmit) {
      onSubmit(data)
    }
  }

  const saveDraftHandler = () => {
    if (onSaveDraft) {
      onSaveDraft(methods.getValues())
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-8">
        {schema.sections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="p-6">
            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.fields.map((field, fieldIndex) => (
                <DynamicFormField key={`${sectionIndex}-${fieldIndex}`} field={field} disabled={readOnly} />
              ))}
            </div>
          </Card>
        ))}

        {!readOnly && (
          <div className="flex justify-end gap-4">
            {onSaveDraft && (
              <Button type="button" variant="outline" onClick={saveDraftHandler} disabled={isSubmitting || !isDirty}>
                Сохранить черновик
              </Button>
            )}

            {onSubmit && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Отправка..." : "Отправить"}
              </Button>
            )}
          </div>
        )}
      </form>
    </FormProvider>
  )
}

// Функция для построения схемы валидации Zod на основе JSON-схемы
function buildValidationSchema(schema: FormSchema): z.ZodObject<any> {
  const shape: Record<string, any> = {}

  schema.sections.forEach((section) => {
    section.fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny = z.any()

      switch (field.type) {
        case "text":
        case "textarea":
          fieldSchema = z.string()
          if (field.required) {
            fieldSchema = fieldSchema.min(1, { message: "Поле обязательно для заполнения" })
          } else {
            fieldSchema = fieldSchema.optional()
          }
          break

        case "number":
          fieldSchema = z.number().optional()
          if (field.required) {
            fieldSchema = z.number({
              required_error: "Поле обязательно для заполнения",
              invalid_type_error: "Введите число",
            })
          }
          break

        case "select":
          fieldSchema = z.string()
          if (field.required) {
            fieldSchema = fieldSchema.min(1, { message: "Выберите значение" })
          } else {
            fieldSchema = fieldSchema.optional()
          }
          break

        case "date":
          fieldSchema = z.string()
          if (field.required) {
            fieldSchema = fieldSchema.min(1, { message: "Выберите дату" })
          } else {
            fieldSchema = fieldSchema.optional()
          }
          break

        case "checkbox":
          fieldSchema = z.boolean().optional()
          if (field.required) {
            fieldSchema = z.boolean().refine((val) => val === true, {
              message: "Необходимо согласие",
            })
          }
          break

        case "file":
          fieldSchema = z.any().optional()
          if (field.required) {
            // В реальном приложении здесь будет более сложная валидация файлов
            fieldSchema = z.any().refine((val) => val !== undefined, {
              message: "Файл обязателен",
            })
          }
          break

        default:
          fieldSchema = field.required ? z.any() : z.any().optional()
      }

      shape[field.name] = fieldSchema
    })
  })

  return z.object(shape)
}

