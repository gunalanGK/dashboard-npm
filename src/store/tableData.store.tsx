import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TableDataStoreData {
  loading: boolean;
  data: any;
  error: string | null;
  selectedTables: string[];
  updateLoading: () => void;
  setTableData: (data: any) => void;   
  updateError: (error: string) => void;
  setSelectedTables: (tables: string[]) => void;
}

export const useTableDataStore = create<TableDataStoreData>()(
  devtools((set) => ({
    loading: false,
    data: null,
    error: null,
    selectedTables: [],
    updateLoading: () => set((state) => ({ ...state, loading: true })),
    setTableData: (data: any) => 
      set((state) => ({ ...state, loading: false, data })),
    updateError: (error: string) => 
      set((state) => ({ ...state, loading: false, error })),
    setSelectedTables: (selectedTables: string[]) => 
      set((state) => ({ ...state, selectedTables })),
  }))
);