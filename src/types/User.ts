import type { Workspace } from './Workspace'

export interface User {
  email?: string
  password?: string
  workspace?: Workspace[]
}
