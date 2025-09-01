import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    showAuthDialog: false,
    authMode: 'signin' as 'signin' | 'signup',
  }),

  actions: {
    openDialog(mode: 'signin' | 'signup' = 'signin') {
      this.showAuthDialog = true
      this.authMode = mode
    },

    closeDialog() {
      this.showAuthDialog = false
    },
  },
})
