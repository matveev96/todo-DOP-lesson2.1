import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolistId: string
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    removeTask: (payload:{todolistId: string, taskId: string}) => void
    changeFilter: (payload: {todolistId: string, value: FilterValuesType}) => void
    addTask: (payload:{todolistId: string, title: string}) => void
    changeTaskStatus: (payload:{todolistId: string, taskId: string, isDone: boolean}) => void
    removeTodolist: (todolistId: string) => void
}

export function Todolist(props: PropsType) {

    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const addTask = () => {
        if (title.trim() !== "") {
            props.addTask({todolistId: props.todolistId, title: title.trim()});
            setTitle("");
        } else {
            setError("Title is required");
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if (e.charCode === 13) {
            addTask();
        }
    }

    const onAllClickHandler = () => props.changeFilter({todolistId: props.todolistId, value: "all"});
    const onActiveClickHandler = () => props.changeFilter({todolistId: props.todolistId, value: "active"});
    const onCompletedClickHandler = () => props.changeFilter({todolistId: props.todolistId, value: "completed"});

    const removeTodolistHandler = () => {
        props.removeTodolist(props.todolistId)
    }

    const filterOfTasks = () => {
        switch (props.filter) {
            case "active": return props.tasks.filter(t => !t.isDone);
            case "completed": return props.tasks.filter(t => t.isDone);
            default: return props.tasks
        }
    }
    const tasksForTodolist = filterOfTasks()

    return <div>
        <h3>
            {props.title}
            <button onClick={removeTodolistHandler}>X</button>

        </h3>
        <div>
            <input value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   className={error ? "error" : ""}
            />
            <button onClick={addTask}>+</button>
            {error && <div className="error-message">{error}</div>}
        </div>
        <ul>
            {
                tasksForTodolist.map(t => {
                    const onClickHandler = () => props.removeTask({todolistId: props.todolistId, taskId: t.id})
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus({todolistId: props.todolistId, taskId: t.id, isDone: e.currentTarget.checked});
                    }

                    return <li key={t.id} className={t.isDone ? "is-done" : ""}>
                        <input type="checkbox"
                               onChange={onChangeHandler}
                               checked={t.isDone}/>
                        <span>{t.title}</span>
                        <button onClick={onClickHandler}>x</button>
                    </li>
                })
            }
        </ul>
        <div>
            <button className={props.filter === 'all' ? "active-filter" : ""}
                    onClick={onAllClickHandler}>All
            </button>
            <button className={props.filter === 'active' ? "active-filter" : ""}
                    onClick={onActiveClickHandler}>Active
            </button>
            <button className={props.filter === 'completed' ? "active-filter" : ""}
                    onClick={onCompletedClickHandler}>Completed
            </button>
        </div>
    </div>
}
