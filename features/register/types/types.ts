export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  export interface RegisterFormProps {
    onToggle?: () => void;
  }
  