import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TaskDataStoreData {
  loading: boolean;
  taskData: any[];
  error: string | null;
  selectTable: string[];
  updateLoading: () => void;
  updateTaskData: (data: any) => void;
  updateError: (error: string) => void;
  updateTaskDoneById: (payload: { id: string; done: boolean }) => void;
  updateSelectTable: (selectTable: string[]) => void;
}

export const useTaskDataStore = create<TaskDataStoreData>()(
  devtools((set) => ({
    loading: false,
    error: null,
    taskData: [],
    selectTable: [],
    updateSelectTable: (data: string[]) =>
      set((state: TaskDataStoreData) => ({ ...state, selectTable: data })),
    updateLoading: () =>
      set((state: TaskDataStoreData) => ({ ...state, loading: true })),
    updateTaskData: (data: any) =>
      set((state: TaskDataStoreData) => ({
        ...state,
        loading: false,
        taskData: data,
      })),
    updateTaskDoneById: (payload: { id: string; done: boolean }) =>
      set((state: TaskDataStoreData) => ({
        ...state,
        taskData: state.taskData?.map((task) =>
          task.id === payload.id ? { ...task, completed: payload.done } : task
        ),
      })),
    updateError: (error: string) =>
      set((state: TaskDataStoreData) => ({ ...state, loading: false, error })),
  }))
);
