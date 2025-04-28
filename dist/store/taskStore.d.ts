interface TaskDataStoreData {
    loading: boolean;
    taskData: any[];
    error: string | null;
    updateLoading: () => void;
    updateTaskData: (data: any) => void;
    updateError: (error: string) => void;
    updateTaskDoneById: (payload: {
        id: string;
        done: boolean;
    }) => void;
}
export declare const useTaskDataStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<TaskDataStoreData>, "setState"> & {
    setState(partial: TaskDataStoreData | Partial<TaskDataStoreData> | ((state: TaskDataStoreData) => TaskDataStoreData | Partial<TaskDataStoreData>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: TaskDataStoreData | ((state: TaskDataStoreData) => TaskDataStoreData), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
}>;
export {};
