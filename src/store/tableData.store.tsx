import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TableDataStoreData {
  loading: boolean;
  data: any;
  error: string | null;
  updateLoading: () => void;
  tableData: (data: any) => void;
  updateError: (error: string) => void;
}

export const useTableDataStore = create<TableDataStoreData>()(
  devtools((set) => ({
    loading: false,
    data: null,
    error: null,
    updateLoading: () =>
      set((state: TableDataStoreData) => ({ ...state, loading: true })),
    tableData: (data: any) =>
      set((state: TableDataStoreData) => ({ ...state, loading: false, data })),
    updateError: (error: string) =>
      set((state: TableDataStoreData) => ({ ...state, loading: false, error })),
  }))
);
