import { Task } from "@/types/task";
import { toast } from "sonner";
import { create } from "zustand";

type TasksStore = {
  tasks: Task[];
  addTask: (name: string) => void;
  deleteTask: (id: string) => void;
  getTask: (id: string) => void;
  updateTask: (task: Task) => void;
  toggleTask: (id: string) => void;
};

function makeId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  tasks: [],

  addTask: (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: makeId(),
      name: trimmed,
      completed: false,
    };

    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },

  deleteTask: (id: string) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    toast.success("task deleted successfully");
  },

  getTask: (id: string) => {
    return get().tasks.find((t) => t.id === id);
  },

  updateTask(task: Task) {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    }));
  },

  toggleTask(id: string) {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    }));
  },

  
}));
