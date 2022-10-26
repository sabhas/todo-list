export interface Task {
  id: string
  name: string
  complete: boolean
}

export interface List {
  id: string
  name: string
  tasks: Task[]
}
