import { getGreeting } from "@/services/helper/service";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import InsertCommentOutlinedIcon from "@mui/icons-material/InsertCommentOutlined";
import { useEffect, useState } from "react";
import { clientApiGetCall, clientApiPutCall } from "@/services/api/api.service";
import { useTaskDataStore } from "@/store/taskStore";
import DoughnutChartComponent from "@/components/DoughnutChart";
import BarChartComponent from "@/components/BarChart";
import { apiClient } from "@/services/api/api";
import { useTableNameStore } from "@/store/tableNameList.store";
import { getDateForTask, isDateTodayOrFuture } from "@/services/common.service";

const DashboardDetailsPage = ({
  acceptedUserData,
  columnData,
  workspaceId,
  userName,
}: {
  acceptedUserData: any;
  columnData: any;
  workspaceId: any;
  userName: string;
}) => {
  const { taskData, updateTaskDoneById } = useTaskDataStore();
  const [cardData, setcardData] = useState([]);

  const { tableName } = useTableNameStore();

  let datasetDetailsId: any = {};

  tableName?.forEach((data) => {
    datasetDetailsId = { ...datasetDetailsId, [data.id]: data };
  });

  const getCoardData = async () => {
    const response = await apiClient.post(`/get-data/metrics`, [
      ...columnData.DataCards,
    ]);

    if (response.data) {
      setcardData(response.data);
    }
  };

  useEffect(() => {
    getCoardData();
  }, [columnData.metrics]);

  const getAssignTo = (assignTo: string[]) => {
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
            className="w-24px h-24px p-2 radius-360 bg-avatarColor txt-blue-darken10 d-flex align-center justify-center avatar-drawer"
            alt="user"
            width={24}
            height={24}
          />
        ))}
        {getUserData.length > 4 && (
          <div className="w-24px h-24px p-2 radius-360 bg-avatarColor txt-blue-darken10 d-flex align-center justify-center avatar-drawer">
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

  const toggleCompleteTask = async ({
    id,
    completed,
    datasetId,
    datasetName,
    rowId,
  }: {
    id: string;
    completed: boolean;
    datasetId: string;
    datasetName: string;
    rowId: string;
  }) => {
    // dispatch(
    //   toggleCompletedTask(
    //     workspaceId,
    //     { id, completed, recordId: rowId },
    //     dataset.id,
    //     dataset.datasetName
    //   )
    // );

    try {
      const url = `workspace/${workspaceId}/datasets/${datasetId}/${datasetName}/engagement/task/task-isCompleted`;

      const response = await clientApiPutCall(url, {
        id,
        completed,
        recordId: rowId,
      });

      console.log("response", response);

      if (response?.data?.error) {
        // updateError(response.data.error);
      } else {
        updateTaskDoneById({ id, done: completed });

        console.log(
          "-------->",
          taskData?.map((task) =>
            task.id === id ? { ...task, done: completed } : task
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="d-flex mb-8">
        <div className="f-w-600 f-28 txt-text-grey-primary ">
          {`${getGreeting()}, ${userName}.`}
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
            <div>
              <img
                src="/images/frame.svg"
                width={16}
                height={16}
                alt="filter"
              />
            </div>
          </div>
          <div className="bg-bg-task maxh-772px p-12 flex-1 overflow-auto">
            {taskData?.map((task) => (
              <div
                className={`p-16 mb-10 bg-white radius-8
                   ${
                     task?.dueDate
                       ? !isDateTodayOrFuture(getDateForTask(task?.dueDate))
                         ? "border-solid-popper-border"
                         : "border-solid-error-border"
                       : "border-solid-popper-border"
                   } 
                `}
              >
                <div className="d-flex h-24px align-center justify-between mb-4">
                  <div className="d-flex">
                    <div className="h-100 w-100 d-flex radius-4 bg-blue-lighten9 border-blue-lighten10 align-center justify-center p-4 mr-4">
                      <span className=" txt-blue-darken10 material-icons-outlined f-16  txt-text-grey-primary">
                        {datasetDetailsId[task.recordId]?.icon}
                      </span>
                    </div>
                    <div className="d-flex align-center f-w-600 f-12 txt-blue-darken8">
                      {datasetDetailsId[task.recordId]?.displayName}
                    </div>
                  </div>

                  <div>
                    {task?.completed ? (
                      <img
                        src={"/dataset-record-drawer/Check_1.svg"}
                        alt="undone"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                        onClick={() => {
                          toggleCompleteTask({
                            id: task.id,
                            completed: !task.completed,
                            datasetId: datasetDetailsId[task.recordId]?.id,
                            datasetName:
                              datasetDetailsId[task.recordId]?.datasetName,
                            rowId: task.recordId,
                          });
                        }}
                      />
                    ) : (
                      <img
                        src={"/dataset-record-drawer/check_circle_outline.svg"}
                        alt="undone"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                        onClick={() => {
                          toggleCompleteTask({
                            id: task.id,
                            completed: !task.completed,
                            datasetId: datasetDetailsId[task.recordId]?.id,
                            datasetName:
                              datasetDetailsId[task.recordId]?.datasetName,
                            rowId: task.recordId,
                          });
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="h-20px f-w-500 f-14 txt-shadow mb-4">
                  {task.title}
                </div>

                {task?.description ? (
                  <div className="h-40px f-w-400 f-12 txt-close-icon truncate-2-lines l-h-20">
                    Create a dynamic data card component for the dashboard that
                    includes fields for title, data source, and data aggregation
                    type
                  </div>
                ) : (
                  <></>
                )}

                {task?.commentCount ? (
                  <div className="mt-8">
                    <InsertCommentOutlinedIcon className="f-20 txt-grey-secondary mr-4" />
                    <p>{task?.commentCount}</p>
                  </div>
                ) : (
                  <></>
                )}

                <div className="mt-8 d-flex align-center justify-between">
                  <div>{getAssignTo(task.assignTo)}</div>
                  <div className="p-4 radius-4 bg-blue-lighten9">
                    {timeConverter(task.updatedAt)}
                  </div>
                </div>
              </div>
              // <div className="maxh-176px p-16 mb-10 bg-white radius-8">
              //   <div className="d-flex">
              //     <div className="mr-8">
              //       {task?.completed ? (
              //         <img
              //           src={"/dataset-record-drawer/Check_1.svg"}
              //           alt="undone"
              //           width={20}
              //           height={20}
              //           className="cursor-pointer"
              //         />
              //       ) : (
              //         <img
              //           src={"/dataset-record-drawer/check_circle_outline.svg"}
              //           alt="undone"
              //           width={20}
              //           height={20}
              //           className="cursor-pointer"
              //         />
              //       )}
              //     </div>
              //     <div className="flex-1 text-trim">{task.title}</div>
              //   </div>

              //   <div className="mt-8">
              //     <InsertCommentOutlinedIcon className="f-20 txt-grey-secondary mr-4" />
              //   </div>

              //   <div className="mt-8 d-flex align-center justify-between">
              //     <div>{getAssignTo(task.assignTo)}</div>
              //     <div className="p-4 radius-4 bg-blue-lighten9">
              //       {timeConverter(task.updatedAt)}
              //     </div>
              //   </div>
              // </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardDetailsPage;
