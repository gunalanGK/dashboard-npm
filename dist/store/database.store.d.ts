interface DBData {
    loading: boolean;
    dbData: unknown | null;
    error: string | null;
    updateLoading: () => void;
    updatebdData: (newDbdata: unknown) => void;
    updateError: (error: string) => void;
}
export declare const useDatabaseStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<DBData>, "setState"> & {
    setState(partial: DBData | Partial<DBData> | ((state: DBData) => DBData | Partial<DBData>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: DBData | ((state: DBData) => DBData), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
}>;
export {};
