import type { Task } from './Task'

export interface Workspace {
  id?: number
  title?: string
  description?: string
  task?: Task[]
  createdAt?: string
}
