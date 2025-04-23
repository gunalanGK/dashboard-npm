export declare const apiClient: import("axios").AxiosInstance;
export declare const fetchTableColumnDataTypes: (selectedTables: string[]) => Promise<any>;
export declare const uploadCSVFiles: (files: FileList) => Promise<any>;
export declare const fetchTableNames: () => Promise<string[]>;
export declare const fetchTableData: (tableName: string) => Promise<any>;
