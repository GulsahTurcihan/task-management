"use client";

import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTasksListQuery,
} from "@/hooks/useTasks";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  /* const tasks = useTasksStore((store) => store.tasks);
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
  } */ // zustand example

  const { data, isLoading, isError, error } = useTasksListQuery();

  const tasks = data ?? [];

  const createTaskMutation = useCreateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const [taskName, setTaskName] = useState("");

  function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    const trimmed = taskName.trim();
    if (!trimmed) {
      toast.error("name field can not be empty");
      return;
    }

    createTaskMutation.mutate(trimmed, {
      onSuccess: () => {
        toast.success("task is added successfully");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });

    setTaskName("");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-xl space-y-6">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900 text-center">
            Task Manager
          </h1>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Write a task..."
              className="flex-1 text-slate-800 rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={createTaskMutation.isPending}
              className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {createTaskMutation.isPending ? "adding..." : "Submit"}
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {isLoading && (
            <p className="text-sm text-slate-600">Task list is loading...</p>
          )}
          {isError && <p>{error?.message || "there is an error"}</p>}
          {!isLoading && !isError && (data?.length ?? 0) === 0 && (
            <p>There is no task yet. You can add a task above.</p>
          )}
          {!isLoading &&
            !isError &&
            tasks.map((task) => (
              <div
                key={task._id}
                className="rounded-2xl border bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p
                    className={`min-w-0 truncate font-medium ${task.completed ? "line-through text-slate-500 " : "text-slate-900"}`}
                  >
                    {task.name}
                  </p>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/tasks/${task._id}`}
                      className="rounded-xl border border-yellow-200 text-yellow-500 px-3 py-2 text-sm hover:bg-yellow-50"
                    >
                      Edit
                    </Link>
                    <button
                      disabled={deleteTaskMutation.isPending}
                      onClick={() => {
                        deleteTaskMutation.mutate(task._id, {
                          onSuccess: () => toast.success("Task is deleted"),
                          onError: (err) => toast.error(err.message),
                        });
                      }}
                      className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
