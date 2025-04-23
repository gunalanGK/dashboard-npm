declare const useTableData: (selectedTable: string | null) => {
    tableData: unknown[];
    isLoading: boolean;
    setIsLoading: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    error: string | null;
};
export default useTableData;
