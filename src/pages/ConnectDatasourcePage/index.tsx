import { memo, useCallback, useEffect, useRef, useState } from "react";
import ConnectDatasourceModal from "@/components/ConnectDatasourceModal";
import { Button } from "@mui/material";
import {
  connectToDatabase,
  disconnectToDatabase,
} from "@/services/api/database";
import { useDashboardStore } from "@/store/dashboardState.store";
import DashboardDetailsPage from "../DashboardDetailsPage";
import { apiClient } from "@/services/api/api";
import { useTaskDataStore } from "@/store/taskStore";
import LoadingPage from "../LoadingPage";

type ConnectDatasourcePageProps = {
  payload: any;
  acceptedUserData: any;
  workspaceId: string;
  userName: string;
  datasetRecord: any;
};

const ConnectDatasourccePage = ({
  payload,
  acceptedUserData,
  workspaceId,
  userName,
  datasetRecord,
}: ConnectDatasourcePageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConnect, setIsConnect] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const initializingRef = useRef(false);
  const isConnectedRef = useRef(false);

  const { columnData, setColumnData, setSelectedTables } = useDashboardStore();
  const { updateSelectTable } = useTaskDataStore();

  const connectDB = useCallback(async () => {
    if (isConnectedRef.current) return true;

    try {
      await connectToDatabase(payload);
      setIsConnect(true);
      isConnectedRef.current = true;
      return true;
    } catch (err) {
      console.error("DB connection failed:", err);
      setIsConnect(false);
      isConnectedRef.current = false;
      return false;
    }
  }, [payload]);

  const disconnectDB = useCallback(async () => {
    if (!isConnectedRef.current) return;

    try {
      await disconnectToDatabase();
      isConnectedRef.current = false;
    } catch (err) {
      console.error("DB disconnection failed:", err);
    }
  }, []);

  const fetchLatestDashboard = useCallback(async () => {
    try {
      const response = await apiClient.get(`upload/check-dashboard`);

      if (response?.data?.success && response.data.data) {
        const dashboardData = response.data.data;

        const workIds = dashboardData.workIds || [];

        setColumnData(dashboardData);
        setSelectedTables(workIds);
        updateSelectTable(workIds);
      } else {
        console.log("No dashboard found or API returned failure");
        setColumnData(null);
        setSelectedTables([]);
        updateSelectTable([]);
      }
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setColumnData(null);
      setSelectedTables([]);
      updateSelectTable([]);
    }
  }, [workspaceId, setColumnData, setSelectedTables, updateSelectTable]);

  const initializeDashboard = useCallback(async () => {
    if (initializingRef.current) {
      return;
    }

    initializingRef.current = true;
    setIsInitializing(true);
    try {
      console.log("Initializing dashboard...");
      const dbConnected = await connectDB();
      if (dbConnected) {
        await fetchLatestDashboard();
      }
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    } finally {
      setIsInitializing(false);
      initializingRef.current = false;
    }
  }, [connectDB, fetchLatestDashboard]);

  useEffect(() => {
    initializeDashboard();

    return () => {
      disconnectDB();
    };
  }, [workspaceId]);

  const handleDashboardCreated = useCallback(() => {
    fetchLatestDashboard();
  }, [fetchLatestDashboard]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  if (isInitializing) {
    return;
  }

  if (columnData) {
    return (
      <div className="flex-1 p-16 overflow-auto">
        <DashboardDetailsPage
          acceptedUserData={acceptedUserData}
          columnData={columnData}
          workspaceId={workspaceId}
          userName={userName}
          datasetRecord={datasetRecord}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 d-flex flex-column align-center justify-center overflow-auto">
        <div className="d-flex flex-column align-center justify-center">
          <div className="w-360px h-256px d-flex align-center justify-center">
            <img
              src="/images/emptydashboard.svg"
              width={208}
              height={124}
              alt="empty dashboard"
            />
          </div>

          <div className="my-16 d-flex flex-column align-center justify-center">
            <div className="f-w-600 f-14 txt-shadow mb-8">No dashboard yet</div>
            <div className="f-w-400 f-12 txt-grey-darken4">
              Create a dashboard to visualize your data, track progress, and
            </div>
            <div className="f-w-400 f-12 txt-grey-darken4">
              get insights in one place.
            </div>
          </div>

          <div>
            <Button
              className="w-184px h-40px"
              variant="contained"
              sx={{
                backgroundColor: "#FB7000 !important",
                color: "#fff !important",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#e65f00 !important",
                },
              }}
              onClick={() => setIsModalOpen(true)}
            >
              <p className="f-w-500">+ Create dashboard</p>
            </Button>
          </div>
        </div>
      </div>

      <ConnectDatasourceModal
        workspaceId={workspaceId}
        isOpen={isModalOpen}
        closeModal={closeModal}
      />
    </>
  );
};

export default memo(ConnectDatasourccePage);
