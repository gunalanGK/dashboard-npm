import { memo, useEffect, useState } from "react";
import ConnectDatasourceModal from "@/components/ConnectDatasourceModal";
import { Button } from "@mui/material";
import { connectToDatabase } from "@/services/api/database";
import { useDashboardStore } from "@/store/dashboardState.store";
import DashboardCharts from "../Dashboard/DashboardCharts";
import DashboardPage from "@/DashboardPage";
import DashboardDetailsPage from "../DashboardDetailsPage";

// need to update the type
const ConnectDatasourccePage = ({
  payload,
  acceptedUserData,
  workspaceId,
}: {
  payload: any;
  acceptedUserData: any;
  workspaceId: any;
}) => {
  //  connectDatasource modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { columnData } = useDashboardStore();

  const connectDB = async () => {
    await connectToDatabase(payload);
  };

  useEffect(() => {
    connectDB();
  }, [payload]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return columnData ? (
    <div className="flex-1  p-16  overflow-auto">
      {/* <DashboardCharts columnData={columnData} /> */}
      <DashboardDetailsPage
        acceptedUserData={acceptedUserData}
        columnData={columnData}
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
