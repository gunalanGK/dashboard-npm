import ConnectDatasourcePage from "./pages/ConnectDatasourcePage/index";

const DashboardPage = ({
  payload,
  acceptedUserData,
  workspaceId,
}: {
  payload: any;
  acceptedUserData: any;
  workspaceId: any;
}) => {
  return (
    <ConnectDatasourcePage
      payload={payload}
      acceptedUserData={acceptedUserData}
      workspaceId={workspaceId}
    />
  );
};

export default DashboardPage;
