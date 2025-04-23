interface TableDataStoreData {
    loading: boolean;
    data: any;
    error: string | null;
    updateLoading: () => void;
    tableData: (data: any) => void;
    updateError: (error: string) => void;
}
export declare const useTableDataStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<TableDataStoreData>, "setState"> & {
    setState(partial: TableDataStoreData | Partial<TableDataStoreData> | ((state: TableDataStoreData) => TableDataStoreData | Partial<TableDataStoreData>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: TableDataStoreData | ((state: TableDataStoreData) => TableDataStoreData), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
}>;
export {};
