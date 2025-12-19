import { FormField } from '@/components/form/type'

export const registerFields: FormField[] = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Enter your full name',
    required: true,
    validation: {
      pattern: /^[a-zA-Z\s]{2,50}$/,
      message: 'Name must contain only letters and spaces (2-50 characters)'
    },
    options: []
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email',
    required: true,
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    options: []
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
    validation: {
      pattern: /^.{8,}$/,
      message: 'Password must be at least 8 characters long'
    },
    options: []
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm your password',
    required: true,
    options: []
  }
];