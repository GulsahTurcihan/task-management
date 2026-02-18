"use client";

import { useTasksStore } from "@/store/tasks";
import { Task } from "@/types/task";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function TaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const getTask = useTasksStore((store) => store.getTask);
  const updateTask = useTasksStore((store) => store.updateTask);

  const initial = useMemo(() => getTask(id), [getTask, id]);
  const [task, setTask] = useState<Task | null>(initial ?? null);

  if (!task) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto w-full max-w-xl">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold">The task not found </h1>
            <Link
              href="/"
              className="mt-4 inline-block rounded-xl border px-4 py-2 hover:bg-slate-50"
            >
              Home Page
            </Link>
          </div>
        </div>
      </main>
    );
  }

  function onSave(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!task) return;
    updateTask(task);
    toast.success("task updated successfully");

    setTimeout(() => {
      router.replace("/");
    }, 700);
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl text-slate-900 font-semibold">Edit Task</h1>
            <Link href="/" className="text-sm underline text-slate-700">
              Back
            </Link>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-500">
            <div>
              <span className="font-medium text-slate-800">TaskID:</span>{" "}
              {task.id}
            </div>
          </div>
          <form onSubmit={onSave} className="mt-5 space-y-4">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-800"
                htmlFor="TaskName"
              >
                Task Name
              </label>
              <input
                value={task.name}
                onChange={(e) =>
                  setTask((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev,
                  )
                }
                className=" text-slate-800 w-full font-normal flex-1 rounded-xl px-4 py-2 outline-none border border-slate-200 focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <label
              htmlFor=""
              className="flex items-center gap-2 text-sm text-slate-500"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) =>
                  setTask((prev) =>
                    prev ? { ...prev, completed: e.target.checked } : prev,
                  )
                }
                className="h-4 w-4"
              />
              Completed
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 transition-colors duration-300 cursor-pointer"
              >
                Save
              </button>
              <Link
                href="/"
                className="rounded-xl border px-4 py-2 text-slate-800 hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
