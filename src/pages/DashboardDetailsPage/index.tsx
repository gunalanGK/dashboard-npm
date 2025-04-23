import { getGreeting } from "@/services/helper/service";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import InsertCommentOutlinedIcon from "@mui/icons-material/InsertCommentOutlined";
import { useEffect, useState } from "react";
import { clientApiGetCall } from "@/services/api/api.service";
import { useTaskDataStore } from "@/store/taskStore";
import DoughnutChartComponent from "@/components/DoughnutChart";
import BarChartComponent from "@/components/BarChart";
import { apiClient } from "@/services/api/api";

const DashboardDetailsPage = ({
  acceptedUserData,
  columnData,
}: {
  acceptedUserData: any;
  columnData: any;
}) => {
  const { taskData } = useTaskDataStore();
  const [cardData, setcardData] = useState([]);

  const getCoardData = async () => {
    const response = await apiClient.post(`/get-data/metrics`, [
      ...columnData.DataCards,
    ]);

    if (response.data) {
      console.log("response.data", response.data);

      setcardData(response.data);
    }
  };

  useEffect(() => {
    getCoardData();
  }, [columnData.metrics]);

  const getAssignTo = (assignTo: string[]) => {
    console.log("assignTo", acceptedUserData);

    if (!acceptedUserData.data.length) {
      return "";
    }

    const getUserData = assignTo?.map((id) =>
      acceptedUserData.data.find((user: any) => user.id === id)
    );
    const showUserData =
      getUserData.length > 4 ? getUserData.slice(0, 5) : getUserData;

    return (
      <div className="d-flex align-center">
        {showUserData.map((userData) => (
          <img
            key={userData?.id}
            src={userData?.picture || "/dataset-record-drawer/person.jpg"}
            className="w-32px h-32px p-2 radius-360 bg-avatarColor txt-blue-darken10 d-flex align-center justify-center avatar-drawer"
            alt="user"
            width={24}
            height={24}
          />
        ))}
        {getUserData.length > 4 && (
          <div className="w-32px h-32px p-2 radius-360 bg-avatarColor txt-blue-darken10 d-flex align-center justify-center avatar-drawer">
            +{getUserData.length - 4}
          </div>
        )}
      </div>
    );
  };

  const timeConverter = (time: string) => {
    const date = new Date(time);

    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return formatted;
  };

  return (
    <>
      <div className="d-flex mb-8">
        <div className="f-w-600 f-28 txt-text-grey-primary ">
          {`${getGreeting()}, Name.`}
        </div>
        <div></div>
      </div>

      <div className=" d-flex h-36px mb-16 border-b-solid-popper-border ">
        <div className=" py-10 border-b-solid-blue-darken10">
          <div className="f-13 pl-8 f-w-500 txt-blue-darken10 d-flex align-center justify-center">
            CRM
          </div>
          <MoreHorizIcon className="f-14 txt-blue-darken10" />
        </div>
      </div>

      <div className="h-92px mb-16 d-flex gap-16 overflow-auto justify-between ">
        {cardData?.map((data: any) => (
          <div className=" flex-1 radius-8 border-solid-border-1 p-16">
            {/* title */}
            <div className="f-14 mb-8 f-w-400 txt-grey-darken4">
              {data.metric}
            </div>
            <div className="f-w-600 f-24 txt-shadow">{data.value}</div>
          </div>
        ))}
      </div>

      <div className="h-822px d-flex gap-16">
        <div className="flex-1">
          <div className="d-flex gap-16">
            <div className="h-388px flex-1 d-flex flex-column radius-8 border-solid-border-1">
              <div className="h-56px d-flex align-center justify-between p-12">
                <div className="d-flex align-center f-w-600 f-16 txt-text-grey-primary">
                  {columnData?.plotData[0]?.plot_name}
                </div>
                <MoreHorizIcon />
              </div>
              <div className="flex-1 d-flex align-center justify-center p-12">
                <DoughnutChartComponent
                  key={columnData?.plotData[0]?.plot_name}
                  tableData={columnData?.plotData[0]?.data}
                />
              </div>
            </div>

            <div className="h-388px flex-1 radius-8 border-solid-border-1">
              <div className="h-56px d-flex align-center justify-between p-12">
                <div className="d-flex align-center f-w-600 f-16 txt-text-grey-primary">
                  {columnData?.plotData[1]?.plot_name}
                </div>
                <MoreHorizIcon />
              </div>
              <div>
                <BarChartComponent
                  key={columnData?.plotData[1]?.plot_name}
                  tableData={columnData?.plotData[1]?.data}
                />
              </div>
            </div>
          </div>

          <div></div>
        </div>

        <div className="maxh-822px w-354px border-solid-task-dashboard-border radius-8 d-flex flex-column ">
          <div className="h-42px p-12  d-flex justify-between align-center">
            <div className="f-w-600 f-16 txt-task-color">Task</div>
            <div>image</div>
          </div>
          <div className="bg-bg-task maxh-772px p-12 flex-1 overflow-auto">
            {taskData?.map((task) => (
              <div className="maxh-176px p-16 mb-10 bg-white radius-8">
                <div className="d-flex">
                  <div className="mr-8">
                    {task?.completed ? (
                      <img
                        src={"/dataset-record-drawer/Check_1.svg"}
                        alt="undone"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                      />
                    ) : (
                      <img
                        src={"/dataset-record-drawer/check_circle_outline.svg"}
                        alt="undone"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                  <div className="flex-1 text-trim">{task.title}</div>
                </div>

                <div className="mt-8">
                  <InsertCommentOutlinedIcon className="f-20 txt-grey-secondary mr-4" />
                </div>

                <div className="mt-8 d-flex align-center justify-between">
                  <div>{getAssignTo(task.assignTo)}</div>
                  <div className="p-4 radius-4 bg-blue-lighten9">
                    {timeConverter(task.updatedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardDetailsPage;
