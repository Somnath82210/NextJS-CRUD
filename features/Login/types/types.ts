export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

//register

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface User {
  id: string
  email:string
  password:string
  role?:string
  name:string
}
