import type { FormRules } from 'element-plus'

const validateTask = (fieldName: string) => {
  return (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (!value || value.trim() === '') {
      return callback(new Error(`Please input ${fieldName}`))
    }

    callback()
  }
}

export const taskRules = (form: any): FormRules => ({
  title: {
    required: true,
    validator: validateTask('task title'),
    trigger: 'blur',
  },

  description: {
    required: true,
    validator: validateTask('task description'),
    trigger: 'blur',
  },
})
