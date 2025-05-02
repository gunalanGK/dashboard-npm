import { memo, useEffect, useState } from "react";
import ConnectDatasourceModal from "@/components/ConnectDatasourceModal";
import { Button } from "@mui/material";
import { connectToDatabase } from "@/services/api/database";
import { useDashboardStore } from "@/store/dashboardState.store";
import DashboardCharts from "../Dashboard/DashboardCharts";
import DashboardPage from "@/DashboardPage";
import DashboardDetailsPage from "../DashboardDetailsPage";
import { clientApiGetCall } from "@/services/api/api.service";
import { useDashboardTemplateStore } from "@/store/dashboardTemplate.store";
import {
  fetchDashboardTemplate,
  fetchTableColumnDataTypes,
} from "@/services/api/api";
import { DashboardTemplate } from "@/utils/constants/dashboardTemplate";
import { useTaskDataStore } from "@/store/taskStore";

// need to update the type
const ConnectDatasourccePage = ({
  payload,
  acceptedUserData,
  workspaceId,
  userName,
}: {
  payload: any;
  acceptedUserData: any;
  workspaceId: any;
  userName: string;
}) => {
  //  connectDatasource modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { columnData, setColumnData } = useDashboardStore();
  const { dashboardTemplateList, updateDashboardTemplateList, updateError } =
    useDashboardTemplateStore();

  const { updateSelectTable } = useTaskDataStore();

  const connectDB = async () => {
    await connectToDatabase(payload);
  };

  const getDashboardTemplateList = async () => {
    try {
      const dashboardTemplateList = await clientApiGetCall(
        `workspace/${workspaceId}/dataset/dashboard-template`
      );

      updateDashboardTemplateList(dashboardTemplateList?.data?.data);
    } catch (err) {
      updateError("error");
    }
  };

  const connectAndGetTemplate = async () => {
    await connectDB();
    await getDashboardTemplateList();
  };

  useEffect(() => {
    connectAndGetTemplate();
  }, [payload]);

  const getColumnData = async () => {
    if (dashboardTemplateList?.length) {
      const dashboardTemplateData = dashboardTemplateList[0];

      if (dashboardTemplateData && dashboardTemplateData["template-type"]) {
        const data = await fetchDashboardTemplate(
          dashboardTemplateData.workspace_ids?.split(","),
          dashboardTemplateData["template-type"]
        );
        setColumnData(data);
        updateSelectTable(dashboardTemplateData.workspace_ids?.split(","));
      }
    }
  };

  useEffect(() => {
    if (dashboardTemplateList?.length) {
      getColumnData();
    }
  }, [dashboardTemplateList]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return columnData ? (
    <div className="flex-1  p-16  overflow-auto">
      {/* <DashboardCharts columnData={columnData} /> */}
      <DashboardDetailsPage
        acceptedUserData={acceptedUserData}
        columnData={columnData}
        workspaceId={workspaceId}
        userName={userName}
      />
    </div>
  ) : (
    <>
      <div className="flex-1 d-flex flex-column  align-center justify-center overflow-auto">
        <div className="d-flex flex-column  align-center justify-center">
          <div className="w-360px h-256px d-flex align-center justify-center">
            <img
              src="/images/emptydashboard.svg"
              width={208}
              height={124}
              alt="empty dashboard"
            />
          </div>

          <div className="my-16 d-flex flex-column align-center justify-center">
            <div className="f-w-600 f-14 txt-shadow mb-8">
              We don't have anything to show you!
            </div>
            <div className="f-w-400 f-12 txt-grey-darken4">
              Monitor your projects, track your team's progress, and more
            </div>
            <div className="f-w-400 f-12 txt-grey-darken4">
              with a widget on your dashboard.
            </div>
          </div>

          <div>
            <Button
              color="secondary"
              className="w-184px h-40px"
              style={{ border: "none", borderRadius: "8px" }}
              variant="contained"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              + Connect datasource
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
