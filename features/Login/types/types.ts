
export type LoginFormData = {
  email: string;
  password: string;
};


export interface LoginFormProps {
  onToggle?: () => void;
}