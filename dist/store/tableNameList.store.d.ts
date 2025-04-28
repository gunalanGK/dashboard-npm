interface TableNameStoreData {
    loading: boolean;
    tableName: any[] | null;
    error: string | null;
    updateLoading: () => void;
    tableNameData: (newDbdata: unknown) => void;
    updateError: (error: string) => void;
}
export declare const useTableNameStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<TableNameStoreData>, "setState"> & {
    setState(partial: TableNameStoreData | Partial<TableNameStoreData> | ((state: TableNameStoreData) => TableNameStoreData | Partial<TableNameStoreData>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: TableNameStoreData | ((state: TableNameStoreData) => TableNameStoreData), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
}>;
export {};
