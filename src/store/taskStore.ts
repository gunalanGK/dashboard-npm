import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TaskDataStoreData {
  loading: boolean;
  taskData: any[];
  error: string | null;
  updateLoading: () => void;
  updateTaskData: (data: any) => void;
  updateError: (error: string) => void;
}

export const useTaskDataStore = create<TaskDataStoreData>()(
  devtools((set) => ({
    loading: false,
    error: null,
    taskData: [],
    updateLoading: () =>
      set((state: TaskDataStoreData) => ({ ...state, loading: true })),
    updateTaskData: (data: any) =>
      set((state: TaskDataStoreData) => ({
        ...state,
        loading: false,
        taskData: data,
      })),
    updateError: (error: string) =>
      set((state: TaskDataStoreData) => ({ ...state, loading: false, error })),
  }))
);
