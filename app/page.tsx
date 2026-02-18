"use client";

import { useTasksStore } from "@/store/tasks";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const tasks = useTasksStore((store) => store.tasks);
  const addTask = useTasksStore((store) => store.addTask);
  const deleteTask = useTasksStore((store) => store.deleteTask);
  const toggleTask = useTasksStore((store) => store.toggleTask);

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setError("You should enter a task");
      return;
    }

    addTask(trimmed);
    setName("");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-xl space-y-6">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900 text-center">
            Task Manager
          </h1>

          <form onSubmit={onSubmit} className="mt-4 flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="write a task"
              className="placeholder:text-slate-300 text-slate-800 font-normal flex-1 rounded-xl px-4 py-2 outline-none border border-slate-200 focus:ring-2 focus:ring-slate-300"
            />
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 transition-colors duration-300 cursor-pointer">
              Submit
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-sm text-slate-400">
              There is no task to show. Please add a task below
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl border bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-4 items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />
                    <p
                      className={`min-w-0 truncate font-medium ${task.completed ? "line-through text-slate-500" : "text-slate-900"}`}
                      title={task.name}
                    >
                      {task.name}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="rounded-xl border px-3 py-2 text-white bg-green-800 text-sm hover:bg-green-700 transition-colors duration-300"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-xl border px-3 py-2 text-white bg-red-800 text-sm hover:bg-red-700 transition-colors duration-300 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
