import type { FormRules } from 'element-plus'

const validateWorkspace = (fieldName: string) => {
  return (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (!value || value.trim() === '') {
      return callback(new Error(`Please input ${fieldName}`))
    }

    callback()
  }
}

export const workSpaceRules = (form: any): FormRules => ({
  title: [
    {
      required: true,
      validator: validateWorkspace('workspace title'),
      trigger: 'blur',
    },
  ],

  description: [
    {
      required: true,
      validator: validateWorkspace('workspace description'),
      trigger: 'blur',
    },
  ],
})
