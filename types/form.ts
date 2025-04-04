export interface FormFieldOption {
  label: string
  value: string
}

export interface FormFieldDependency {
  field: string
  value: string | boolean | number
}

export interface FormField {
  name: string
  label: string
  type: "text" | "textarea" | "number" | "select" | "date" | "checkbox" | "file"
  required: boolean
  placeholder?: string
  description?: string
  options?: FormFieldOption[]
  rows?: number
  fullWidth?: boolean
  checkboxLabel?: string
  dependsOn?: FormFieldDependency
}

export interface FormSection {
  title: string
  fields: FormField[]
}

export interface FormSchema {
  sections: FormSection[]
}

