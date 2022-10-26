import { List, Task } from "./types"

export const createList = (name: string): List => {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

export const createTask = (name: string): Task => {
  return { id: Date.now().toString(), name: name, complete: false }
}
