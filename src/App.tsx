import React, { useState, useEffect, useRef } from "react"

const LOCAL_STORAGE_LIST_KEY = "task.lists"
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId"

interface Task {
  id: string
  name: string
  complete: boolean
}

interface List {
  id: string
  name: string
  tasks: Task[]
}

const createList = (name: string): List => {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

const createTask = (name: string): Task => {
  return { id: Date.now().toString(), name: name, complete: false }
}

function App() {
  const firstUpdate = useRef(true)
  const [newListName, setNewListName] = useState("")
  const [newTaskName, setNewTaskName] = useState("")
  const [lists, setLists] = useState<List[]>([])
  const [selectedListId, setSelectedListId] = useState("")

  useEffect(() => {
    let listFetchedFromLocalStorage
    try {
      listFetchedFromLocalStorage = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_LIST_KEY) ?? ""
      )
    } catch {
      listFetchedFromLocalStorage = []
    }

    setLists(listFetchedFromLocalStorage)
    setSelectedListId(
      localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY) ?? ""
    )
  }, [])

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
    } else {
      localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
      localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
    }
  }, [lists, selectedListId])

  const getIncompleteTaskCount = (list: List) => {
    const incompleteTaskCount = list.tasks.filter(
      (task: any) => !task.complete
    ).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    return `${incompleteTaskCount} ${taskString} remaining`
  }

  const addNewList = (e: any) => {
    e.preventDefault()
    if (!newListName) return

    const list = createList(newListName)
    setLists((prevLists) => [...prevLists, list])
    setNewListName("")
  }

  const addNewTask = (e: any, listId: string) => {
    e.preventDefault()
    if (!newTaskName) return

    const task = createTask(newTaskName)
    setLists((prevLists) => [
      ...prevLists.map((list) =>
        list.id !== listId ? list : { ...list, tasks: [...list.tasks, task] }
      ),
    ])

    setNewTaskName("")
  }

  const selectedList = lists.find((list) => list.id === selectedListId)

  return (
    <>
      <h1 className="title">Stuff I need to do</h1>
      <div className="tasks-wrapper">
        <div className="all-tasks">
          <h2 className="task-list-title">My lists</h2>
          <ul className="task-list">
            {lists.map((list: any) => (
              <li
                key={list.name}
                className={`list-name ${
                  list.id === selectedListId ? "active-list" : ""
                }`}
                onClick={() => setSelectedListId(list.id)}
              >
                {list.name}
              </li>
            ))}
          </ul>

          <form onSubmit={addNewList}>
            <input
              type="text"
              className="new list"
              placeholder="new list name"
              aria-label="new list name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <button className="btn create" aria-label="create new list">
              +
            </button>
          </form>
        </div>

        {selectedList && (
          <div className="todo-list">
            <div className="todo-header">
              <h2 className="list-title">{selectedList.name}</h2>
              <p className="task-count">
                {getIncompleteTaskCount(selectedList)}
              </p>
            </div>

            <div className="todo-body">
              <div className="tasks">
                {selectedList.tasks.map((task: Task) => (
                  <div className="task">
                    <input
                      type="checkbox"
                      id={task.id}
                      checked={task.complete}
                      onChange={(e) => {
                        task.complete = e.target.checked
                        const updatedTasks = selectedList.tasks.map((item) =>
                          item.id !== task.id
                            ? item
                            : { ...item, complete: e.target.checked }
                        )
                        setLists((prevLists) => [
                          ...prevLists.map((list) =>
                            list.id !== selectedList.id
                              ? list
                              : { ...list, tasks: updatedTasks }
                          ),
                        ])
                      }}
                    />
                    <label htmlFor={task.id}>
                      <span className="custom-checkbox"></span>
                      {task.name}
                    </label>
                  </div>
                ))}
              </div>

              <div className="new-task-creator">
                <form onSubmit={(e) => addNewTask(e, selectedList.id)}>
                  <input
                    type="text"
                    className="new task"
                    placeholder="new task name"
                    aria-label="new task name"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                  />
                  <button className="btn create" aria-label="create new task">
                    +
                  </button>
                </form>
              </div>

              <div className="delete-stuff">
                <button
                  className="btn delete"
                  onClick={() => {
                    const incompleteTasks = selectedList.tasks.filter(
                      (task: any) => !task.complete
                    )

                    setLists((prevLists) => [
                      ...prevLists.map((list) =>
                        list.id !== selectedList.id
                          ? list
                          : { ...list, tasks: incompleteTasks }
                      ),
                    ])
                  }}
                >
                  Clear completed tasks
                </button>
                <button
                  className="btn delete"
                  onClick={() => {
                    setLists((prevLists) => [
                      ...prevLists.filter(
                        (list: List) => list.id !== selectedListId
                      ),
                    ])
                    setSelectedListId("")
                  }}
                >
                  Delete list
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
