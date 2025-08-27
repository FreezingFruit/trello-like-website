import type { Task } from '@/types/Task'
import type { Workspace } from '@/types/Workspace'

import { defineStore } from 'pinia'

export const useWorkSpaceStore = defineStore('workspaces', {
  state: () => ({
    workspaces: [] as Workspace[],
  }),

  actions: {
    loadWorkSpaces() {
      const storedWorkSpaces = localStorage.getItem('workspaces')

      if (storedWorkSpaces) {
        this.workspaces = JSON.parse(storedWorkSpaces)
      } else {
        console.error('No workspaces fetched')
      }
    },
    addWorkSpace(workspace: { title: string; description: string }) {
      const newWorkspace: Workspace = {
        id: Date.now(),
        title: workspace.title,
        description: workspace.description,
        task: [],
        createdAt: new Date().toISOString(),
      }

      this.workspaces.push(newWorkspace)
      this.saveWorkSpaces()
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
