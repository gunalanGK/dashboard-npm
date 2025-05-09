import ConnectDatasourcePage from "./pages/ConnectDatasourcePage/index";

const DashboardPage = ({
  payload,
  acceptedUserData,
  workspaceId,
  userName,
  datasetRecord,
}: {
  payload: any;
  acceptedUserData: any;
  workspaceId: any;
  userName: string;
  datasetRecord: any;
}) => {
  return (
    <ConnectDatasourcePage
      payload={payload}
      acceptedUserData={acceptedUserData}
      workspaceId={workspaceId}
      userName={userName}
      datasetRecord={datasetRecord}
    />
  );
};

export default DashboardPage;
