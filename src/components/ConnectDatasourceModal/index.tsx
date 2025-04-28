import React, { memo, useEffect, useState } from "react";

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
import { fetchTableColumnDataTypes, fetchTableNames } from "@/services/api/api";
import "./ConnectDatasourceModal.scss";
import { useDatabaseStore } from "@/store/database.store";
import { useDashboardStore } from "@/store/dashboardState.store";
import { clientApiGetCall } from "@/services/api/api.service";
import { useTaskDataStore } from "@/store/taskStore";
import { useTableNameStore } from "@/store/tableNameList.store";

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
  const [selectedValues, setSelectedValues] = useState<any[]>([]);

  const { setColumnData } = useDashboardStore();
  const { updateTaskData, updateError, taskData } = useTaskDataStore();

  const { tableNameData } = useTableNameStore();

  const getTablesName = async () => {
    const tables = await fetchTableNames();
    tableNameData(tables);
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

    if (checked) {
      // Add value to state if checked
      setSelectedValues((prev) => [...prev, value]);
    } else {
      // Remove value from state if unchecked
      setSelectedValues((prev) => prev.filter((item) => item !== value));
    }
  };

  const getdashboardData = async () => {
    const data = await fetchTableColumnDataTypes(selectedValues);
    console.log("selectedValues", selectedValues);
    console.log("data", data);

    setColumnData(data);

    try {
      const url = `workspace/${workspaceId}/datasets/engagement/task`;

      const response = await clientApiGetCall(url, {
        workId: selectedValues,
      });

      if (response?.data?.error) {
        updateError(response.data.error);
      } else {
        updateTaskData(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal open={isOpen} onClose={closeModal}>
      <Box
        sx={{
          width: 500,
          height: 520,
          borderRadius: "8px",
          border: "none",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          padding: "20px",
        }}
      >
        {/* header */}
        <div className="mb-20">
          <div className="f-w-600 f-20 txt-text-grey-primary mb-8">
            Connect datasource to this dashboard
          </div>
          <div className="f-w-400 f-14 txt-grey-darken4">
            Based on the datasource you selected, charts will be generated.
          </div>
        </div>

        {/* body */}
        <div className="h-348px">
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
            placeholder="search"
          />

          <div className="">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                sx={{
                  height: "36px",
                }}
              >
                <Tab className="tab-header" label="Works" {...a11yProps(0)} />
                <Tab className="tab-header" label="Groups" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <div className="overflow-auto h-248px">
                {tableDetails?.map((tabDetail) => (
                  <div className="w-460px h-62px py-12 d-flex border-b-solid-border">
                    <Checkbox
                      sx={{
                        height: "24px",
                        width: "24px",
                        padding: "3.6px",
                      }}
                      value={`work_${tabDetail.id}`}
                      onClick={handleCheckboxChange}
                    />
                    <div className="ml-8">
                      <div className="f-w-500 f-14 txt-shadow mb-6">
                        {tabDetail.displayName}
                      </div>
                      <div className="f-w-400 f-12 txt-grey-darken4">
                        {tabDetail.groupName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              Groups
            </CustomTabPanel>
          </div>
        </div>

        {/* footer  */}
        <div className="h-40px d-flex justify-end">
          <div className="mr-10">
            <Button variant="outlined" color="info" onClick={closeModal}>
              Cancel
            </Button>
          </div>

          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={getdashboardData}
            >
              Connect
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

export default memo(ConnectDatasourceModal);
