import { useState, useEffect } from "react";
import { fetchTableData } from "../services/api/api";

const useTableData = (selectedTable: string | null) => {
  const [tableData, setTableData] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTableData = async () => {
      if (selectedTable) {
        setIsLoading(true);
        try {
          const data = await fetchTableData(selectedTable);
          setTableData(data);
        } catch {
          setError("Error retrieving table data");
        } finally {
          setIsLoading(false);
        }
      }
    };
    getTableData();
  }, [selectedTable]);

  return { tableData, isLoading, setIsLoading, error };
};

export default useTableData;
