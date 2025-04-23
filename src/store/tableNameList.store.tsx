import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TableNameStoreData {
  loading: boolean;
  tableName: string[] | null;
  error: string | null;
  updateLoading: () => void;
  tableNameData: (newDbdata: unknown) => void;
  updateError: (error: string) => void;
}

export const useTableNameStore = create<TableNameStoreData>()(
  devtools((set) => ({
    loading: false,
    tableName: null,
    error: null,
    updateLoading: () =>
      set((state: TableNameStoreData) => ({ ...state, loading: true })),
    tableNameData: (newTableName: string[]) =>
      set((state: TableNameStoreData) => ({
        ...state,
        tableName: newTableName,
        loading: false,
      })),
    updateError: (error: string) =>
      set((state) => ({ ...state, error, loading: false })),
  }))
);
