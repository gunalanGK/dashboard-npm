import { create } from 'zustand';

interface DashboardState {
  isFetchingData: boolean;
  currentStep: number;
  selectedTables: string[];
  columnData: any;
  setIsFetchingData: (value: boolean) => void;
  setCurrentStep: (value: number) => void;
  setSelectedTables: (tables: string[]) => void;
  setColumnData: (data: any) => void;
  resetState: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  isFetchingData: false,
  currentStep: 0,
  selectedTables: [],
  columnData: null,
  setIsFetchingData: (value) => set({ isFetchingData: value }),
  setCurrentStep: (value) => set({ currentStep: value }),
  setSelectedTables: (tables) => set({ selectedTables: tables }),
  setColumnData: (data) => set({ columnData: data }),
  resetState: () => set({ 
    isFetchingData: false, 
    currentStep: 0, 
    selectedTables: [], 
    columnData: null 
  }),
}));
