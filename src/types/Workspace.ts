import type { Task } from './Task'
import type { User } from './User'

export interface Workspace {
  id?: number
  title?: string
  description?: string
  task?: Task[]
  ownerEmail?: string
  userWithAccess?: User[]
  createdAt?: string
}
