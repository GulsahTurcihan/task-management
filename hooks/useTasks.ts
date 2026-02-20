import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "@/lib/api";
import type { Task } from "@/types/task";

export function useTasksListQuery() {
  return useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: tasksApi.listTasks,
  });
}

export function useTaskByIdQuery(id: string) {
  return useQuery<Task, Error>({
    queryKey: ["tasks", id],
    queryFn: () => tasksApi.getTaskById(id),
    enabled: Boolean(id)
  })
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, string>({
    mutationFn: (name: string) => tasksApi.createTask(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    Task,
    Error,
    { id: string; name?: string; completed?: boolean }
  >({
    mutationFn: (args) =>
      tasksApi.updateTask(args.id, {
        name: args.name,
        completed: args.completed,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ ok: true }, Error, string>({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
}
