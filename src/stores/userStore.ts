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
    //local storage saving helper
    saveToLocalStorage(key: string, value: unknown) {
      localStorage.setItem(key, JSON.stringify(value))
    },

    loadUser() {
      const userData = localStorage.getItem('users')
      this.users = userData ? JSON.parse(userData) : []
      const activeUserData = localStorage.getItem('activeUser')
      this.activeUser = activeUserData ? JSON.parse(activeUserData) : null
    },

    registerUser(email: string, password: string) {
      const newUser: User = {
        email,
        password,
      }

      this.users.push(newUser)
      this.saveToLocalStorage('users', this.users)

      this.activeUser = newUser
      this.saveToLocalStorage('activeUser', newUser)

      return true
    },

    loginUser(email: string, password: string) {
      const user = this.users.find((u) => u.email === email && u.password === password)

      if (user) {
        this.activeUser = user
        this.saveToLocalStorage('activeUser', user)
        return true
      }
      return false
    },

    logoutUser() {
      this.activeUser = null
      localStorage.removeItem('activeUser')
    },
  },
})
