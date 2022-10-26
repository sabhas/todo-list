import React, { useState, useEffect, useRef } from "react"
import { List } from "./utils/types"
import { createList } from "./utils/helper"
import TodoList from "./components/todoList"

const LOCAL_STORAGE_LIST_KEY = "task.lists"
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId"

function App() {
  const firstUpdate = useRef(true)
  const [newListName, setNewListName] = useState("")
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

  const addNewList = (e: any) => {
    e.preventDefault()
    if (!newListName) return

    const list = createList(newListName)
    setLists((prevLists) => [...prevLists, list])
    setNewListName("")
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
          <TodoList
            selectedList={selectedList}
            selectedListId={selectedListId}
            setSelectedListId={setSelectedListId}
            setLists={setLists}
          />
        )}
      </div>
    </>
  )
}

export default App
