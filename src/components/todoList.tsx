import React, { useState, Dispatch, SetStateAction } from "react"
import { List, Task } from "../utils/types"
import { createTask } from "../utils/helper"

type TodoListPros = {
  selectedList: List
  selectedListId: string
  setSelectedListId: Dispatch<SetStateAction<string>>
  setLists: Dispatch<SetStateAction<List[]>>
}

const TodoList = ({
  selectedList,
  selectedListId,
  setSelectedListId,
  setLists,
}: TodoListPros) => {
  const [hideCompletedTasks, setHideCompletedTasks] = useState(false)
  const [newTaskName, setNewTaskName] = useState("")

  const getIncompleteTaskCount = (list: List) => {
    const incompleteTaskCount = list.tasks.filter(
      (task: any) => !task.complete
    ).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    return `${incompleteTaskCount} ${taskString} remaining`
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

  return (
    <div className="todo-list">
      <div className="todo-header">
        <h2 className="list-title">{selectedList.name}</h2>
        <p className="task-count">{getIncompleteTaskCount(selectedList)}</p>
      </div>

      <div className="todo-body">
        <div className="tasks">
          {selectedList.tasks.map((task: Task) =>
            hideCompletedTasks && task.complete ? null : (
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
            )
          )}
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
            onClick={() => setHideCompletedTasks((prev) => !prev)}
          >
            {hideCompletedTasks ? "Show Completed" : "Hide Completed"}
          </button>

          <button
            className="btn delete"
            onClick={() => {
              setLists((prevLists) => [
                ...prevLists.filter((list: List) => list.id !== selectedListId),
              ])
              setSelectedListId("")
            }}
          >
            Delete list
          </button>
        </div>
      </div>
    </div>
  )
}

export default TodoList
