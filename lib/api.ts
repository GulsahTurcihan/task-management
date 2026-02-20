import { Task } from "@/types/task";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `request failed, HTTP status code: ${response.status}`;

    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

export const tasksApi = {
  listTasks: () => requestJson<Task[]>("/task"),

  getTaskById: (id: string) => requestJson<Task>(`/task/${id}`),

  createTask: (name: string) =>
    requestJson<Task>("/task", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  updateTask: (id: string, payload: { name?: string; completed?: boolean }) =>
    requestJson<Task>(`/task/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteTask: (id: string) =>
    requestJson<{ ok: true }>(`/task/${id}`, {
      method: "DELETE",
    }),
};
