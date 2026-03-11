import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);

  useEffect(() => {
    const savedTodo = JSON.parse(localStorage.getItem("todo")) || [];
    const savedProgress = JSON.parse(localStorage.getItem("progress")) || [];
    const savedDone = JSON.parse(localStorage.getItem("done")) || [];

    setTodoTasks(savedTodo);
    setInProgressTasks(savedProgress);
    setDoneTasks(savedDone);
  }, []);

  useEffect(() => {
    localStorage.setItem("todo", JSON.stringify(todoTasks));
    localStorage.setItem("progress", JSON.stringify(inProgressTasks));
    localStorage.setItem("done", JSON.stringify(doneTasks));
  }, [todoTasks, inProgressTasks, doneTasks]);

  const addTask = () => {
    if (task.trim() === "") return;
    if (todoTasks.includes(task)) return;

    setTodoTasks([...todoTasks, task]);
    setTask("");
  };

  const deleteTask = (index) => {
    setTodoTasks(todoTasks.filter((_, i) => i !== index));
  };

  const moveToProgress = (index) => {
    const task = todoTasks[index];
    setInProgressTasks([...inProgressTasks, task]);
    setTodoTasks(todoTasks.filter((_, i) => i !== index));
  };

  const moveToDone = (index) => {
    const task = inProgressTasks[index];
    setDoneTasks([...doneTasks, task]);
    setInProgressTasks(inProgressTasks.filter((_, i) => i !== index));
  };

  const startEditing = (index, text) => {
    setEditingIndex(index);
    setEditText(text);
  };

  const saveEdit = () => {
    const updated = [...todoTasks];
    updated[editingIndex] = editText;
    setTodoTasks(updated);
    setEditingIndex(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const lists = {
      todo: [todoTasks, setTodoTasks],
      progress: [inProgressTasks, setInProgressTasks],
      done: [doneTasks, setDoneTasks],
    };

    const { source, destination } = result;

    const [sourceList, setSource] = lists[source.droppableId];
    const [destList, setDest] = lists[destination.droppableId];

    const sourceClone = [...sourceList];
    const destClone = [...destList];

    const [removed] = sourceClone.splice(source.index, 1);
    destClone.splice(destination.index, 0, removed);

    setSource(sourceClone);
    setDest(destClone);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="board">

        <h1>Kanban Board</h1>

        <div className="add-task">
          <input
            type="text"
            placeholder="Enter task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
          />
          <button onClick={addTask}>Add</button>
        </div>

        <div className="columns">

          {/* TODO */}

          <Droppable droppableId="todo">
            {(provided) => (
              <div
                className="column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >

                <h2>Todo ({todoTasks.length})</h2>

                {todoTasks.map((t, index) => (
                  <Draggable
                    key={t + index}
                    draggableId={t + index}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="task"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onDoubleClick={() => startEditing(index, t)}
                      >

                        {editingIndex === index ? (
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onBlur={saveEdit}
                            autoFocus
                          />
                        ) : (
                          t
                        )}

                        <br />

                        <button onClick={() => moveToProgress(index)}>
                          Start
                        </button>

                        <button onClick={() => deleteTask(index)}>
                          Delete
                        </button>

                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}

              </div>
            )}
          </Droppable>

          {/* IN PROGRESS */}

          <Droppable droppableId="progress">
            {(provided) => (
              <div
                className="column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >

                <h2>In Progress ({inProgressTasks.length})</h2>

                {inProgressTasks.map((t, index) => (
                  <Draggable
                    key={t + index}
                    draggableId={t + index}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="task"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >

                        {t}

                        <br />

                        <button onClick={() => moveToDone(index)}>
                          Finish
                        </button>

                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}

              </div>
            )}
          </Droppable>

          {/* DONE */}

          <Droppable droppableId="done">
            {(provided) => (
              <div
                className="column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >

                <h2>Done ({doneTasks.length})</h2>

                {doneTasks.map((t, index) => (
                  <Draggable
                    key={t + index}
                    draggableId={t + index}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="task"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >

                        {t}

                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}

              </div>
            )}
          </Droppable>

        </div>

      </div>
    </DragDropContext>
  );
}

export default App;