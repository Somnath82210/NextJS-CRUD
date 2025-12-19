
export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'select';

export interface FormField {
  options: string[];
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  colSpan?: number;
  validation?: {
    pattern: RegExp;
    message: string;
  };
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