import React, { memo, useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  Modal,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

import {
  fetchTableColumnDataTypes,
  fetchTableNames,
  fetchTablesData,
} from "@/services/api/api";
import { useDashboardStore } from "@/store/dashboardState.store";
import { useTaskDataStore } from "@/store/taskStore";
import { useTableDataStore } from "@/store/tableData.store";

import "./ConnectDatasourceModal.scss";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = ({
  children,
  value,
  index,
  ...other
}: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    {...other}
    style={{ height: "100%" }}
  >
    {value === index && <Box>{children}</Box>}
  </div>
);

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

const ConnectDatasourceModal = ({
  workspaceId,
  isOpen,
  closeModal,
}: {
  workspaceId: any;
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const [value, setValue] = useState(0);
  const [tableDetails, setTableDetails] = useState<any[]>([]);
  
  const { selectedTables, setSelectedTables, setColumnData } = useDashboardStore();
  const { updateTaskData, updateError, updateSelectTable } = useTaskDataStore();
  const { setTableData } = useTableDataStore();

  const groupedTables = useMemo(() => {
    const groups: Record<string, any[]> = {};
    tableDetails.forEach((table) => {
      if (!groups[table.groupName]) groups[table.groupName] = [];
      groups[table.groupName].push(table);
    });
    return groups;
  }, [tableDetails]);

  const getTablesName = async () => {
    const tables = await fetchTableNames();
    setTableDetails(tables);
  };

  useEffect(() => {
    if (isOpen) getTablesName();
  }, [isOpen]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCheckboxChange = (event: any) => {
    const { value, checked } = event.target;
    const updated = checked
      ? [...selectedTables, value]
      : selectedTables.filter((item) => item !== value);
    setSelectedTables(updated);
  };

  const handleGroupCheckboxChange = (event: any) => {
    const { value: groupName, checked } = event.target;
    const tablesInGroup = groupedTables[groupName] || [];
    const tableIds = tablesInGroup.map((t) => `work_${t.id}`);

    const updated = checked
      ? Array.from(new Set([...selectedTables, ...tableIds]))
      : selectedTables.filter((t) => !tableIds.includes(t));

    setSelectedTables(updated);
  };

  const isGroupSelected = (groupName: string) => {
    const tableIds = (groupedTables[groupName] || []).map(
      (t) => `work_${t.id}`
    );
    return tableIds.every((id) => selectedTables.includes(id));
  };

  const isGroupPartiallySelected = (groupName: string) => {
    const tableIds = (groupedTables[groupName] || []).map(
      (t) => `work_${t.id}`
    );
    const selectedCount = tableIds.filter((id) =>
      selectedTables.includes(id)
    ).length;
    return selectedCount > 0 && selectedCount < tableIds.length;
  };

  const getDashboardData = async () => {
    if (!selectedTables.length) return;

    try {
      const data = await fetchTableColumnDataTypes(selectedTables);
      setColumnData(data);

      updateSelectTable(selectedTables);

      const response = await fetchTablesData(selectedTables);
      if (response.data.success) {
        setTableData(response.data.data);
      }

      const taskRes = await fetch(
        `workspace/${workspaceId}/datasets/engagement/task`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      const taskData = await taskRes.json();
      if (taskData?.error) updateError(taskData.error);
      else updateTaskData(taskData.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={isOpen} onClose={closeModal}>
      <Box
        sx={{
          width: 500,
          maxHeight: 520,
          borderRadius: "8px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <div className="mb-20">
          <div className="f-w-600 f-20 txt-text-grey-primary mb-8">
            Create Dashboard
          </div>
          <div className="f-w-400 f-14 txt-grey-darken4">
            Select the data sources you want to include in your new dashboard.
            <br />
            Charts will be generated automatically.
          </div>
        </div>

        <TextField
          InputProps={{
            startAdornment: <SearchIcon className="txt-grey-darken5 f-20" />,
            sx: {
              "&::placeholder": {
                color: "#A6AAAFed",
                fontSize: "14px",
                fontWeight: "400",
                opacity: 1,
              },
            },
          }}
          placeholder="Search"
          sx={{ mb: 1 }}
        />

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            TabIndicatorProps={{ style: { backgroundColor: "#0060AA" } }}
          >
            <Tab label="Works" {...a11yProps(0)} />
            <Tab label="Groups" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <Box sx={{ flexGrow: 1, overflow: "scroll", mt: 1 }}>
          <CustomTabPanel value={value} index={0}>
            <Box sx={{ maxHeight: 248, overflowY: "scroll" }}>
              {tableDetails.map((tabDetail) => (
                <Box
                  key={tabDetail.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    height: 62,
                    borderBottom: "1px solid #E0E0E0",
                    px: 1,
                  }}
                >
                  <Checkbox
                    sx={{ height: 24, width: 24 }}
                    value={`work_${tabDetail.id}`}
                    checked={selectedTables.includes(`work_${tabDetail.id}`)}
                    onChange={handleCheckboxChange}
                  />
                  <Box sx={{ ml: 1 }}>
                    <div className="f-w-500 f-14 txt-shadow mb-1">
                      {tabDetail.displayName}
                    </div>
                    <div className="f-w-400 f-12 txt-grey-darken4">
                      {tabDetail.groupName}
                    </div>
                  </Box>
                </Box>
              ))}
            </Box>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <Box sx={{ maxHeight: 248, overflowY: "scroll" }}>
              {Object.entries(groupedTables).map(([groupName, tables]) => {
                const tableNames = tables.map((t) => t.displayName).join(", ");
                const isSelected = isGroupSelected(groupName);
                const isPartial = isGroupPartiallySelected(groupName);

                return (
                  <Box
                    key={groupName}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      height: 62,
                      borderBottom: "1px solid #E0E0E0",
                      px: 1,
                    }}
                  >
                    <Checkbox
                      sx={{ height: 24, width: 24 }}
                      value={groupName}
                      checked={isSelected}
                      indeterminate={isPartial}
                      onChange={handleGroupCheckboxChange}
                    />
                    <Box sx={{ ml: 1 }}>
                      <div className="f-w-500 f-14 txt-shadow mb-1">
                        {groupName}
                      </div>
                      <div className="f-w-400 f-12 txt-grey-darken4">
                        {tableNames}
                      </div>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </CustomTabPanel>
        </Box>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}
        >
          <Button variant="outlined" color="info" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={getDashboardData}
          >
            Connect
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default memo(ConnectDatasourceModal);
