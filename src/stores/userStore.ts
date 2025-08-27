import type { User } from '@/types/User'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
  }),

  actions: {
    saveToLocalStorage() {
      localStorage.setItem('users', JSON.stringify(this.users))
    },

    loadUser() {
      const userData = localStorage.getItem('users')
      if (userData) {
        this.users.push(JSON.parse(userData))
      } else {
        console.log('Failed to fetch user data')
      }
    },

    registerUser(email: string, password: string) {
      const newUser: User = {
        email: email,
        password: password,
      }

      this.users.push(newUser)
      this.saveToLocalStorage()
    },

    loginUser(email: string, password: string) {
      const userEmailCheck = this.users.find((u) => u.email === email)
      //TODO LOGIC
    },
  },
})
