import { FormField } from "@/components/form/type"


export const CREDENTIALS = {
  email: 'user@example.com',
  password: 'password123'
} as const;

export const loginFields: FormField[] = [
  {
    name: 'email',
    label: 'Email address',
    type: 'email',
    placeholder: 'Enter your email',
    autoComplete: 'email',
    options: []
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    autoComplete: 'current-password',
    options: []
  }
];