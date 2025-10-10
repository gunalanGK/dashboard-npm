import React from "react";

type RecordType = Record<string, unknown>;

interface TableDataResponse {
  success?: boolean;
  data?: Record<string, { work_id: string; rows: RecordType[] }>;
}

interface ArrayTable {
  name?: string;
  work_id?: string;
  data: RecordType[];
}

type TablesData =
  | TableDataResponse
  | ArrayTable[]
  | Record<string, { work_id: string; rows: RecordType[] }>
  | null;

interface TableDataProps {
  tablesData: TablesData;
  workspaceId: string;
}

export const TableData: React.FC<TableDataProps> = ({
  tablesData,
  workspaceId,
}) => {
  const fieldsToRemove: string[] = [
    "created_at",
    "created_by",
    "id",
    "is_active",
    "is_archived",
    "is_deleted",
    "is_sample",
    "source",
    "source_id",
    "updated_at",
    "updated_by",
  ];

  const filterTableData = (data: RecordType[]): RecordType[] => {
    return data.map((record: RecordType) => {
      const filteredRecord: RecordType = {};
      Object.keys(record).forEach((key: string) => {
        if (!fieldsToRemove.includes(key)) {
          filteredRecord[key] = record[key];
        }
      });
      return filteredRecord;
    });
  };

  const formatColumnName = (columnName: string): string => {
    return columnName
      .replace(/_/g, " ")
      .split(" ")
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  };

  const formatCellValue = (column: string, value: unknown): string | number => {
    if (value === null || value === undefined) return "--";

    if (typeof value === "string" && value.length > 40) {
      return value.substring(0, 40) + "...";
    }
    return value as string | number;
  };

  const handleViewAll = (workId: string) => {
    if (!workspaceId) return;

    const cleanedId = workId.replace(/^(workId_|work_)/, "");
    const newUrl = `/app/${workspaceId}/${cleanedId}?page=1&limit=20`;
    window.location.href = newUrl;
  };

  const renderTable = (
    tableName: string,
    tableData: RecordType[],
    workId: string,
    index: number
  ) => {
    const filteredData = filterTableData(tableData);
    if (!filteredData.length) return null;

    const columns = Object.keys(filteredData[0]);
    const rowsToShow = filteredData.slice(0, 5);

    return (
      <div key={index} style={{ marginBottom: "2rem" }}>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            margin: 0,
            padding: "0.75rem 1rem",
            border: "1px solid #D1DCE6",
            borderBottom: "none",
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
          }}
        >
          {formatColumnName(tableName)}
        </h3>

        <div
          style={{
            position: "relative",
            overflowX: "auto",
            border: "1px solid #D1DCE6",
            borderTop: "none",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          <table
            style={{
              minWidth: "100%",
              borderCollapse: "collapse",
              border: "1px solid #D1DCE6",
            }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <tr>
                {columns.map((column: string) => (
                  <th
                    key={column}
                    style={{
                      padding: "10px 12px",
                      textAlign: "left",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      border: "1px solid #D1DCE6",
                      whiteSpace: "nowrap",
                      minWidth: "120px",
                    }}
                  >
                    {formatColumnName(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowsToShow.map((record: RecordType, rowIndex: number) => (
                <tr
                  key={rowIndex}
                  style={{
                    fontSize: "0.875rem",
                    transition: "background-color 0.15s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {columns.map((column: string, colIndex: number) => (
                    <td
                      key={colIndex}
                      style={{
                        padding: "10px 12px",
                        border: "1px solid #D1DCE6",
                        whiteSpace: "nowrap",
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {formatCellValue(column, record[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length > 5 && (
          <div
            style={{
              textAlign: "right",
              padding: "10px 12px",
              borderLeft: "1px solid #D1DCE6",
              borderRight: "1px solid #D1DCE6",
              borderBottom: "1px solid #D1DCE6",
              borderBottomLeftRadius: "0.5rem",
              borderBottomRightRadius: "0.5rem",
              boxShadow:
                "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
            }}
          >
            <button
              style={{
                background: "none",
                border: "none",
                padding: 0,
                fontSize: "0.875rem",
                color: "#0060AA",
                cursor: "pointer",
                transition:
                  "color 0.15s ease-in-out, text-decoration 0.15s ease-in-out",
              }}
              onClick={() => handleViewAll(workId)}
            >
              View All
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!tablesData) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "#6b7280",
        }}
      >
        Loading table data...
      </div>
    );
  }

  const renderTables = () => {
    if (
      (tablesData as TableDataResponse).success &&
      (tablesData as TableDataResponse).data
    ) {
      return Object.entries((tablesData as TableDataResponse).data!).map(
        ([tableName, tableInfo], index) =>
          renderTable(tableName, tableInfo.rows, tableInfo.work_id, index)
      );
    } else if (Array.isArray(tablesData)) {
      return (tablesData as ArrayTable[]).map((table, index) =>
        renderTable(
          table.name || `Table ${index + 1}`,
          table.data,
          table.work_id || "",
          index
        )
      );
    } else if (typeof tablesData === "object") {
      return Object.entries(
        tablesData as Record<string, { work_id: string; rows: RecordType[] }>
      ).map(([tableName, tableInfo], index) =>
        renderTable(tableName, tableInfo.rows, tableInfo.work_id, index)
      );
    }

    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "#6b7280",
        }}
      >
        No valid table data found
      </div>
    );
  };

  return <div style={{ marginTop: "1.5rem" }}>{renderTables()}</div>;
};

export default TableData;
