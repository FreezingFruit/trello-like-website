import type { User } from '@/types/User'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    activeUser: null as User | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.activeUser,
    activeEmail: (state) => state.activeUser?.email ?? null,
  },

  actions: {
    saveToLocalStorage() {
      localStorage.setItem('users', JSON.stringify(this.users))
    },

    loadUser() {
      const userData = localStorage.getItem('users')
      this.users = userData ? JSON.parse(userData) : []
      const activeUserData = localStorage.getItem('activeUser')
      this.activeUser = activeUserData ? JSON.parse(activeUserData) : null
    },

    registerUser(email: string, password: string) {
      const newUser: User = {
        email: email,
        password: password,
      }

      this.users.push(newUser)
      this.saveToLocalStorage()

      this.activeUser = newUser
      localStorage.setItem('activeUser', JSON.stringify(newUser))
    },

    loginUser(email: string, password: string) {
      const user = this.users.find((u) => u.email === email && u.password === password)

      if (!user) throw new Error('Invalid credentials')

      this.activeUser = user
      localStorage.setItem('activeUser', JSON.stringify(user))
    },

    logoutUser() {
      this.activeUser = null
      localStorage.removeItem('activeUser')
    },
  },
})
