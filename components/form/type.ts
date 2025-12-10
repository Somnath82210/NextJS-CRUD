
export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  colSpan?: number;
}

export interface DynamicFormProps {
  formData: Record<string, any>;
  onChange: (name: string, value: string) => void;
  formFields: FormField[];
  errors?: Record<string, string>;
  colSpan?: number;
  noGapBottom?: boolean;
  labelClassName?: string;
  inputClassName?: string;
}