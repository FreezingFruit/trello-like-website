import type { Task } from '@/types/Task'
import type { Workspace } from '@/types/Workspace'

import { defineStore } from 'pinia'
import { useUserStore } from './userStore'

export const useWorkSpaceStore = defineStore('workspaces', {
  state: () => ({
    workspaces: [] as Workspace[],
  }),

  getters: {
    //getter for getting workspaces for active users
    forActiveUser(state) {
      const userStore = useUserStore()
      const email = userStore.activeUser?.email
      if (!email) return []
      return state.workspaces.filter((ws) => ws.ownerEmail === email)
    },
    //getter for router /task/:id
    byId: (state) => (id: number) => state.workspaces.find((ws) => ws.id === id),
  },

  actions: {
    loadWorkSpaces() {
      const storedWorkSpaces = localStorage.getItem('workspaces')
      this.workspaces = storedWorkSpaces ? JSON.parse(storedWorkSpaces) : []
    },

    addWorkSpace(workspace: { title: string; description: string }) {
      const userStore = useUserStore()
      if (!userStore.activeUser?.email) {
        throw new Error('Must be logged in to create a workspace')
      }

      const newWorkspace: Workspace = {
        id: Date.now(),
        title: workspace.title,
        description: workspace.description,
        task: [],
        createdAt: new Date().toISOString(),
        ownerEmail: userStore.activeUser.email,
      }

      this.workspaces.push(newWorkspace)
      this.saveWorkSpaces()
      return newWorkspace.id
    },

    saveWorkSpaces() {
      localStorage.setItem('workspaces', JSON.stringify(this.workspaces))
    },

    addTask(
      workspaceId: number,
      task: { title: string; description: string; status: 'todo' | 'doing' | 'done' },
    ) {
      const workspace = this.workspaces.find((ws) => ws.id === workspaceId)
      console.log(workspace)
      console.log(task)
      if (!workspace) {
        console.log('No workspace found')
      }

      const newTask: Task = {
        id: Date.now(),
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: new Date().toISOString(),
        editing: false,
      }

      workspace!.task?.push(newTask)
      this.saveWorkSpaces()
    },

    deleteTask(workspaceId: number, taskId: number) {
      const workspace = this.workspaces.find((ws) => ws.id === workspaceId)

      if (!workspace?.task) return

      workspace.task = workspace.task.filter((t) => t.id !== taskId)
      this.saveWorkSpaces()
    },
  },
})
