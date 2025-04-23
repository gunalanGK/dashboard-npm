import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DBData {
  loading: boolean;
  dbData: unknown | null;
  error: string | null;
  updateLoading: () => void;
  updatebdData: (newDbdata: unknown) => void;
  updateError: (error: string) => void;
}

export const useDatabaseStore = create<DBData>()(
  devtools((set) => ({
    loading: false,
    dbData: null,
    error: null,
    updateLoading: () => set((state: DBData) => ({ ...state, loading: true })),
    updatebdData: (newDbdata) =>
      set((state: DBData) => ({
        ...state,
        dbData: newDbdata,
        loading: false,
      })),
    updateError: (error: string) => set((state) => ({ ...state, error })),
  }))
);
