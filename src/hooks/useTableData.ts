import { useState, useEffect } from "react";
import { fetchTablesData } from "@/services/api/api";
import { useTableDataStore } from "@/store/tableData.store";

export const useDashboardData = () => {
  const { setTableData, setSelectedTables, selectedTables, data } = useTableDataStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async (tables: string[]) => {
    if (tables && tables.length > 0) {
      setIsLoading(true);
      setError(null);
      setSelectedTables(tables);
      
      try {
        const tableData = await fetchTablesData(tables);
        setTableData(tableData);
      } catch (err) {
        setError("Error retrieving table data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setTableData(null);
      setSelectedTables([]);
    }
  };

  return {
    isLoading,
    error,
    tableData: data,
    selectedTables,
    fetchDashboardData,
  };
};
