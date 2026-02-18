"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { Task } from "@/types/task";

type TasksContextValue = {
  tasks: Task[];
  addTask: (name: string) => void;
  deleteTask: (id: string) => void;
  getTask: (id: string) => Task | undefined;
  updateTask: (task: Task) => void;
};

const TasksContext = createContext<TasksContextValue | null>(null);

function makeId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: makeId(),
      name: trimmed,
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getTask = useCallback(
    (id: string) => {
      return tasks.find((t) => t.id === id);
    },
    [tasks],
  );

  const updateTask = useCallback((task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  }, []);

  // setState(prev => prev.map(item = > condition ? updateItem : item))

  const value = useMemo(
    () => ({ tasks, addTask, deleteTask, getTask, updateTask }),
    [tasks, getTask, addTask, deleteTask, updateTask],
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}

{
  /* useReducer daha büyük ölçekli state yönetiminde */
}

type TasksState2 = {
  tasks: Task[];
};

type TasksAction =
  | { type: "ADD_TASK"; payload: { name: string } }
  | { type: "DELETE_TASK"; payload: { id: string } }
  | { type: "UPDATE_TASK"; payload: { task: Task } };

type TasksContextValue2 = {
  tasks: Task[];
  addTask: (name: string) => void;
  deleteTask: (id: string) => void;
  getTask: (id: string) => void;
  updateTask: (task: Task) => void;
};

const TasksContext2 = createContext<TasksContextValue2 | null>(null);

function tasksReducer(state: TasksState2, action: TasksAction): TasksState2 {
  switch (action.type) {
    case "ADD_TASK": {
      const trimmed = action.payload.name.trim();
      if (!trimmed) return state;

      const newTask2: Task = {
        id: makeId(),
        name: trimmed,
        completed: false,
      };

      return { tasks: [newTask2, ...state.tasks] };
    }

    case "DELETE_TASK": {
      return { tasks: state.tasks.filter((t) => t.id !== action.payload.id) };
    }

    case "UPDATE_TASK": {
      const updated = action.payload.task;
      return {
        tasks: state.tasks.map((t) => (t.id === updated.id ? updated : t)),
      };
    }

    default:
      return state;
  }
}

export function TasksProvider2({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tasksReducer, { tasks: [] });

  const addTask = useCallback((name: string) => {
    dispatch({ type: "ADD_TASK", payload: { name } });
  }, []);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: "DELETE_TASK", payload: { id } });
  }, []);

  const updateTask = useCallback((task: Task) => {
    dispatch({ type: "UPDATE_TASK", payload: { task } });
  }, []);

  const getTask = useCallback(
    (id: string) => {
      return state.tasks.find((t) => t.id === id);
    },
    [state.tasks],
  );

  const value = useMemo(
    () => ({
      tasks: state.tasks,
      addTask,
      deleteTask,
      getTask,
      updateTask,
    }),
    [state.tasks, addTask, deleteTask, getTask, updateTask],
  );

  return (
    <TasksContext2.Provider value={value}>{children}</TasksContext2.Provider>
  );
}

export function useTasks2() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("");
  return ctx;
}
