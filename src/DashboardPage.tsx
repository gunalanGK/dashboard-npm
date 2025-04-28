import ConnectDatasourcePage from "./pages/ConnectDatasourcePage/index";

const DashboardPage = ({
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
  return (
    <ConnectDatasourcePage
      payload={payload}
      acceptedUserData={acceptedUserData}
      workspaceId={workspaceId}
      userName={userName}
    />
  );
};

export default DashboardPage;
