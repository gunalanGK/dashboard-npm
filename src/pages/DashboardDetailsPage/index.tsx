import { getGreeting } from "@/services/helper/service";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InsertCommentOutlinedIcon from "@mui/icons-material/InsertCommentOutlined";
import { useCallback, useEffect, useState } from "react";
import { clientApiGetCall, clientApiPutCall } from "@/services/api/api.service";
import { useTaskDataStore } from "@/store/taskStore";
import DoughnutChartComponent from "@/components/DoughnutChart";
import BarChartComponent from "@/components/BarChart";
import { apiClient } from "@/services/api/api";
import { useTableNameStore } from "@/store/tableNameList.store";
import { getDateForTask, isDateTodayOrFuture } from "@/services/common.service";
import HistogramChartComponent from "@/components/HistogramChart";
import PieChartComponent from "@/components/PieChart";
import LineChartComponent from "@/components/AreaChart";
import AreaChartComponent from "@/components/LineChart";
// import LineChartComponent from "@/components/LineChart";
import { Button, IconButton } from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const DashboardDetailsPage = ({
  acceptedUserData,
  columnData,
  workspaceId,
  userName,
  datasetRecord,
}: {
  acceptedUserData: any;
  columnData: any;
  workspaceId: any;
  userName: string;
  datasetRecord: any;
}) => {
  const {
    taskData,
    updateTaskDoneById,
    selectTable,
    updateTaskData,
    updateError,
  } = useTaskDataStore();
  const [cardData, setcardData] = useState([]);

  const { tableName } = useTableNameStore();

  const updateRecordDrawerQuery = ({
    recordDrawerId,
    recordDrawerTab,
    recordDrawerDataset,
  }: {
    recordDrawerId?: string | null;
    recordDrawerTab?: string | null;
    recordDrawerDataset?: string | null;
  }) => {
    if (typeof window === "undefined") return; // guard for SSR

    const url = new URL(window.location.href);
    const params = url.searchParams;

    const updates = { recordDrawerId, recordDrawerTab, recordDrawerDataset };

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined) return; // leave as-is
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const newUrl = `${url.pathname}?${params.toString()}${url.hash}`;
    window.history.replaceState(null, "", newUrl);
  };

  let datasetDetailsId: any = {};

  datasetRecord?.forEach((data: any) => {
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

  // const { taskData } = useTaskDataStore();
  // const [cardData, setCardData] = useState([]);
  const [plotDatasets, setPlotDatasets] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      const cardResponse = await apiClient.post(`/get-data/metrics`, [
        ...columnData.DataCards,
      ]);
      if (cardResponse.data) {
        setcardData(cardResponse.data);
      }
      const plotDetails = columnData.plotData.map(async (plot: any) => {
        const response = await apiClient.get(
          `/get-data/xy-data?${plot.params}`
        );
        return {
          plot_name: plot.plot_name,
          plot_type: plot.plot_type,
          data: response.data,
        };
      });
      const PlotsData = await Promise.all(plotDetails);
      setPlotDatasets(PlotsData);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  const getselectTable = async () => {
    try {
      const url = `workspace/${workspaceId}/datasets/engagement/task`;

      const response = await clientApiGetCall(url, {
        workId: selectTable,
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

  useEffect(() => {
    if (columnData?.metrics || columnData?.plotData) {
      fetchDashboardData();
      getselectTable();
    }
  }, [columnData]);

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

      if (response?.data?.error) {
        // updateError(response.data.error);
      } else {
        updateTaskDoneById({ id, done: completed });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderChart = (plot: any) => {
    switch (plot.plot_type) {
      case "doughnut":
        return <DoughnutChartComponent tableData={plot.data} />;
      case "bar":
        return <BarChartComponent tableData={plot.data} />;
      case "histogram":
        return <HistogramChartComponent tableData={plot.data} />;
      case "pie":
        return <PieChartComponent tableData={plot.data} />;
      case "line":
        return <LineChartComponent tableData={plot.data} />;
      case "area":
        return <AreaChartComponent tableData={plot.data} />;
      default:
        return <div>Unsupported Plot</div>;
    }
  };

  return (
    <>
      <div className="d-flex mb-8 justify-between h-32px">
        <div className="f-w-600 f-28 txt-text-grey-primary ">
          {`${getGreeting()}, ${userName}.`}
        </div>
        <div className="d-flex">
          <div className="mr-12 cursor-pointer">
            <div className="w-132px h-32px border-solid-border-1 radius-8 d-flex align-center justify-between p-8">
              <DateRangeIcon className="f-16 txt-brown-dark1" />
              <div className="txt-brown-dark1 f-14 f-w-400">This week</div>
              <KeyboardArrowDownIcon className="f-16 txt-grey-secondary" />
            </div>
          </div>

          <Button
            color="primary"
            variant="contained"
            sx={{
              borderRadius: "8px",
            }}
            className="small-button dashboard-export-padding"
          >
            Export
          </Button>

          <div
            className="ml-12 mr-12"
            style={{
              border: "2px",
              backgroundColor: "#D2D4D7",
              borderRadius: "4px",
              width: "3px",
            }}
          ></div>

          <div className="w-32px h-32px radius-8 border-solid-border-1 d-flex align-center justify-center cursor-pointer">
            <img width={16} height={16} src="/images/editdashboard.svg" />
          </div>
        </div>
      </div>

      <div className=" d-flex h-36px mb-16 border-b-solid-popper-border ">
        <div className=" d-flex py-10 border-b-solid-blue-darken10">
          <div className="f-13 pl-8 f-w-500 txt-blue-darken10 d-flex align-center justify-center mr-8">
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
        <div className="flex-1 d-flex flex-column gap-16">
          {Array.from(
            { length: Math.ceil(plotDatasets?.length / 2) },
            (_, rowIdx) => (
              <div key={rowIdx} className="d-flex gap-16">
                {plotDatasets
                  ?.slice(rowIdx * 2, rowIdx * 2 + 2)
                  ?.map((plot, idx) => (
                    <div
                      key={idx}
                      className="h-388px flex-1 d-flex flex-column radius-8 border-solid-border-1"
                    >
                      <div className="h-56px d-flex align-center justify-between p-12">
                        <div className="d-flex align-center f-w-600 f-16 txt-text-grey-primary">
                          {plot.plot_name}
                        </div>
                        <MoreHorizIcon />
                      </div>
                      <div className="flex-1 d-flex justify-center align-center p-12">
                        {renderChart(plot)}
                      </div>
                    </div>
                  ))}
              </div>
            )
          )}
        </div>

        <div className="maxh-822px w-354px border-solid-task-dashboard-border radius-8 d-flex flex-column">
          <div className="h-42px p-12 d-flex justify-between align-center">
            <div className="f-w-600 f-16 txt-task-color">Task</div>
            <div className="d-flex align-center h-26px">
              <div className="mr-12 cursor-pointer">
                <div className="w-120px h-26px border-solid-border-1 radius-8 d-flex align-center justify-between px-8">
                  <DateRangeIcon className="f-16 txt-brown-dark1" />
                  <div className="txt-brown-dark1 f-14 f-w-400">This week</div>
                  <KeyboardArrowDownIcon className="f-16 txt-grey-secondary" />
                </div>
              </div>

              <div
                className="mr-12"
                style={{
                  border: "2px",
                  backgroundColor: "#D2D4D7",
                  borderRadius: "4px",
                  width: "3px",
                  height: "90%",
                }}
              ></div>

              <img
                className="cursor-pointer"
                src="/images/framedashboard.svg"
                width={16}
                height={16}
                alt="filter"
              />
            </div>
          </div>
          <div className="bg-bg-task maxh-772px p-12 flex-1 overflow-auto">
            {taskData?.map((task) => {
              const isDueExpired = isDateTodayOrFuture(
                getDateForTask("2025-05-07T17:56:17.099Z")
              );
              return (
                <div
                  className={`p-16 mb-10 bg-white radius-8 
                   ${
                     task?.dueDate
                       ? !isDueExpired
                         ? "border-solid-popper-border"
                         : "border-solid-error-border"
                       : "border-solid-popper-border"
                   } 
                `}
                >
                  <div className="d-flex h-24px align-center justify-between mb-4">
                    <div className="d-flex align-center">
                      <div className="h-100 w-24px d-flex radius-4 bg-blue-lighten9 border-blue-lighten10 align-center justify-center p-4 mr-4">
                        <span className=" txt-blue-darken10 material-icons-outlined f-16  txt-text-grey-primary">
                          {datasetDetailsId[task.workId]?.icon}
                        </span>
                      </div>
                      <div className=" flex-1 maxw-200  f-w-600 f-12 txt-blue-darken8 text-truncate">
                        {datasetDetailsId[task.workId]?.name}
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
                              datasetId: datasetDetailsId[task.workId]?.id,
                              datasetName:
                                datasetDetailsId[task.workId]?.datasetName,
                              rowId: task.recordId,
                            });
                          }}
                        />
                      ) : (
                        <img
                          src={
                            "/dataset-record-drawer/check_circle_outline.svg"
                          }
                          alt="undone"
                          width={20}
                          height={20}
                          className="cursor-pointer"
                          onClick={() => {
                            toggleCompleteTask({
                              id: task.id,
                              completed: !task.completed,
                              datasetId: datasetDetailsId[task.workId]?.id,
                              datasetName:
                                datasetDetailsId[task.workId]?.datasetName,
                              rowId: task.recordId,
                            });
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div
                    className="h-20px f-w-500 f-14 txt-shadow mb-4 cursor-pointer"
                    onClick={() => {
                      updateRecordDrawerQuery({
                        recordDrawerDataset:
                          datasetDetailsId[task.workId]?.datasetName,
                        recordDrawerId: task.recordId,
                        recordDrawerTab: "3",
                      });
                    }}
                  >
                    {task.title}
                  </div>

                  {task?.description ? (
                    <div className="maxh-40px f-w-400 f-12 txt-close-icon truncate-2-lines l-h-20">
                      {task?.description}
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className="mt-8 d-flex">
                    <InsertCommentOutlinedIcon className="f-16 txt-grey-secondary mr-4" />
                    <p className="f-12 f-w-500 txt-grey-secondary">
                      {task?.commentCount}
                    </p>
                  </div>

                  <div className="mt-8 d-flex align-center justify-between">
                    <div>{getAssignTo(task.assignTo)}</div>
                    {task.dueDate ? (
                      <div
                        className={`p-4 radius-4 f-12 f-w-600 ${
                          isDueExpired
                            ? "bg-error-lighten1 txt-error-dark1"
                            : "bg-blue-lighten9 txt-blue-darken10"
                        }`}
                      >
                        {timeConverter(task.dueDate)}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardDetailsPage;
