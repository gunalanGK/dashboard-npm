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
export declare const useDashboardStore: import("zustand").UseBoundStore<import("zustand").StoreApi<DashboardState>>;
export {};
