import { useState, useEffect } from "react";
import { fetchTableNames } from "../services/api/api";

const useTableNames = () => {
  const [tableNames, setTableNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTableNames = async () => {
      try {
        const names = await fetchTableNames();
        setTableNames(names);
      } catch {
        setError("Error retrieving table names");
      }
    };
    getTableNames();
  }, []);

  return { tableNames, error };
};

export default useTableNames;
