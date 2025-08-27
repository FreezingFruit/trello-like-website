import type { User } from '@/types/User'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    activeUser: null as User | null,
  }),

  actions: {
    saveToLocalStorage() {
      localStorage.setItem('users', JSON.stringify(this.users))
    },

    loadUser() {
      const userData = localStorage.getItem('users')
      if (userData) {
        this.users = JSON.parse(userData)
      } else {
        console.log('Failed to fetch user data')
      }

      const activeUserData = localStorage.getItem('activeUser')
      if (activeUserData) {
        this.activeUser = JSON.parse(activeUserData)
      }
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

      if (!user) {
        console.error('Cannot find email')
        return false
      }

      this.activeUser = user
      localStorage.setItem('activeUser', JSON.stringify(user))
      return true
    },

    logoutUser() {
      this.activeUser = null
      localStorage.removeItem('activeUser')
    },
  },
})
