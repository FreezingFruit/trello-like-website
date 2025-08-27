import type { FormRules } from 'element-plus'

const emailPattern = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/
const passwordPattern =
  /^(?=.*[A-ZÑ])(?=.*[a-zñ])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-zÑñ\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/

const validateEmail = (fieldName: string) => {
  return (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (!value || value.trim() === '') {
      return callback(new Error(`Please input ${fieldName}`))
    }
    if (!emailPattern.test(value.trim())) {
      return callback(new Error(`Please enter a valid ${fieldName}`))
    }
    callback()
  }
}

const validatePassword = (fieldName: string) => {
  return (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (!value || value.trim() === '') {
      return callback(new Error(`Please input ${fieldName}`))
    }
    if (!passwordPattern.test(value.trim())) {
      return callback(new Error(`Please enter a valid ${fieldName}`))
    }
    callback()
  }
}

const validateConfirmPassword = (form: { password: string }, fieldName: string) => {
  return (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (!value || value.trim() === '') {
      return callback(new Error(`Please input ${fieldName}`))
    }
    if (value !== form.password) {
      return callback(new Error(`Password do not match!`))
    }
    callback()
  }
}

export const userFormRules = (form: { password: string }): FormRules => ({
  email: [
    {
      required: true,
      validator: validateEmail('email'),
      trigger: 'blur',
    },
  ],

  password: [
    {
      required: true,
      validator: validatePassword('password'),
      trigger: 'blur',
    },
  ],

  confirmPassword: [
    {
      required: true,
      validator: validateConfirmPassword(form, 'confirm password'),
      trigger: ['blur', 'change'],
    },
  ],
})
