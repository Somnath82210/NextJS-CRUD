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
    required: true,
    autoComplete: 'email'
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
    autoComplete: 'current-password'
  }
];