import { useEffect, useRef, useState } from "react";

import { Button } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import InsertCommentOutlinedIcon from "@mui/icons-material/InsertCommentOutlined";
import DateRangeIcon from "@mui/icons-material/DateRange";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { getGreeting } from "@/services/helper/service";
import { clientApiGetCall, clientApiPutCall } from "@/services/api/api.service";
import { apiClient, fetchTablesData } from "@/services/api/api";
import { getDateForTask, isDateTodayOrFuture } from "@/services/common.service";

import { useTaskDataStore } from "@/store/taskStore";
import { useTableDataStore } from "@/store/tableData.store";
import { useDashboardStore } from "@/store/dashboardState.store";

import DoughnutChartComponent from "@/components/DoughnutChart";
import BarChartComponent from "@/components/BarChart";
import HistogramChartComponent from "@/components/HistogramChart";
import PieChartComponent from "@/components/PieChart";
import LineChartComponent from "@/components/LineChart";
import AreaChartComponent from "@/components/AreaChart";
import ScatterPlotComponent from "@/components/ScatterChart";

import { TableData } from "@/components/TableData";
import LoadingPage from "../LoadingPage";

type CardDataItem = {
  metric: string;
  value: number;
};

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
  const [cardData, setcardData] = useState<CardDataItem[]>([]);
  const { selectedTables } = useDashboardStore();

  const [plotDatasets, setPlotDatasets] = useState<any[]>();
  const [tablesData, setTablesData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const chartRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState<number>(500);

  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [hoverTask, setHoverTask] = useState<string | null>(null);
  const taskRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (chartRef.current) {
      setChartHeight(chartRef.current.offsetHeight);
    }
  }, [plotDatasets]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        setChartHeight(chartRef.current.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateRecordDrawerQuery = ({
    recordDrawerId,
    recordDrawerTab,
    recordDrawerDataset,
  }: {
    recordDrawerId?: string | null;
    recordDrawerTab?: string | null;
    recordDrawerDataset?: string | null;
  }) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const params = url.searchParams;

    const updates = { recordDrawerId, recordDrawerTab, recordDrawerDataset };

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined) return;
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

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const [cardResponse, plotsData, tablesData] = await Promise.all([
        apiClient.post(`/get-data/metrics`, [...columnData.DataCards]),
        Promise.all(
          columnData?.plotData?.map(async (plot: any) => {
            const response = await apiClient.get(
              `/get-data/xy-data?${plot.params}`
            );
            return {
              plot_name: plot.plot_name,
              plot_type: plot.plot_type,
              data: response.data,
            };
          }) || []
        ),
        fetchTablesData(selectedTables),
      ]);

      if (cardResponse.data) {
        setcardData(cardResponse.data);
      }

      setPlotDatasets(plotsData);
      setTablesData(tablesData);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setIsLoading(false);
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

  const isAllDataLoaded =
    cardData.length &&
    plotDatasets &&
    plotDatasets.length &&
    tablesData &&
    taskData;

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
        {showUserData?.map((userData) => (
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
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
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
    try {
      const url = `workspace/${workspaceId}/datasets/${datasetId}/${datasetName}/engagement/task/task-isCompleted`;

      const response = await clientApiPutCall(url, {
        id,
        completed,
        recordId: rowId,
      });

      if (!response?.data?.error) {
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
      case "scatter":
        return <ScatterPlotComponent tableData={plot.data} />;
      default:
        return <div>Unsupported Plot</div>;
    }
  };

  if (isLoading || !isAllDataLoaded) {
    return <LoadingPage />;
  }

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
            sx={{ borderRadius: "8px" }}
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

      <div className="h-92px mb-16 d-flex gap-16 overflow-auto justify-between ">
        {cardData?.map((data: any, index: number) => (
          <div
            key={index}
            className=" flex-1 radius-8 border-solid-border-1 p-16"
          >
            <div className="f-14 mb-8 f-w-400 txt-grey-darken4">
              {data.metric}
            </div>
            <div className="f-w-600 f-24 txt-shadow">{data.value}</div>
          </div>
        ))}
      </div>

      <div className="d-flex gap-16">
        <div ref={chartRef} className="flex-1 d-flex flex-column gap-16">
          {plotDatasets?.length ? (
            Array.from(
              { length: Math.ceil(plotDatasets?.length / 2) },
              (_, rowIdx) => (
                <div key={rowIdx} className="d-flex gap-16 flex-1">
                  {plotDatasets
                    ?.slice(rowIdx * 2, rowIdx * 2 + 2)
                    ?.map((plot, idx) => (
                      <div
                        key={idx}
                        className="flex-1 d-flex flex-column radius-8 border-solid-border-1"
                      >
                        <div className="h-56px d-flex align-center justify-between p-12">
                          <div className="d-flex align-center f-w-600 f-16 txt-text-grey-primary">
                            {plot.plot_name}
                          </div>
                          <MoreHorizIcon />
                        </div>
                        <div className="flex-1 d-flex justify-center align-center p-6">
                          {renderChart(plot)}
                        </div>
                      </div>
                    ))}
                </div>
              )
            )
          ) : (
            <></>
          )}
        </div>

        <div
          className="w-400px border-solid-border-1 radius-8 d-flex flex-column"
          style={{
            height: chartHeight,
            overflow: "hidden",
          }}
        >
          <div className="h-42px p-12 d-flex justify-between align-center border-b-solid-border-1">
            <div className="f-w-600 f-16 txt-task-color">Task</div>
          </div>

          <div
            className="bg-bg-task p-12 flex-1"
            style={{
              overflowY: "auto",
              overflowX: "hidden",
              backgroundColor: "#F5F5F5",
            }}
          >
            {taskData?.map((task) => {
              const isDueExpired = isDateTodayOrFuture(
                getDateForTask(task?.dueDate)
              );
              return (
                <div
                  key={task.id}
                  className={`p-16 mb-10 bg-white radius-8 ${
                    task?.dueDate
                      ? !isDueExpired
                        ? "border-solid-popper-border"
                        : "border-solid-error-border"
                      : "border-solid-popper-border"
                  }`}
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
                          alt="done"
                          width={20}
                          height={20}
                          className="cursor-pointer"
                          onClick={() =>
                            toggleCompleteTask({
                              id: task.id,
                              completed: !task.completed,
                              datasetId: datasetDetailsId[task.workId]?.id,
                              datasetName:
                                datasetDetailsId[task.workId]?.datasetName,
                              rowId: task.recordId,
                            })
                          }
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
                          onClick={() =>
                            toggleCompleteTask({
                              id: task.id,
                              completed: !task.completed,
                              datasetId: datasetDetailsId[task.workId]?.id,
                              datasetName:
                                datasetDetailsId[task.workId]?.datasetName,
                              rowId: task.recordId,
                            })
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div
                    ref={(el) => (taskRefs.current[task.id] = el)}
                    className="h-20px f-w-500 f-14 txt-shadow mb-4 cursor-pointer"
                    onClick={() => {
                      updateRecordDrawerQuery({
                        recordDrawerDataset:
                          datasetDetailsId[task.workId]?.datasetName,
                        recordDrawerId: task.recordId,
                        recordDrawerTab: "3",
                      });
                    }}
                    onMouseEnter={() => setHoverTask(task.recordId)}
                    onMouseLeave={() => setHoverTask(null)}
                    style={{
                      maxWidth: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      position: "relative",
                    }}
                  >
                    {task.title}

                    {hoverTask === task.recordId && (
                      <div
                        style={{
                          position: "fixed",
                          backgroundColor: "#1f2937",
                          color: "#fff",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
                          pointerEvents: "none",
                          top: `${
                            taskRefs.current[task.id]?.getBoundingClientRect()
                              .top! - 10
                          }px`,
                          left: `${taskRefs.current[
                            task.id
                          ]?.getBoundingClientRect().left!}px`,
                          zIndex: 1000,
                          maxWidth: "350px",
                          width: "auto",
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                          lineHeight: "1.4",
                          transform: "translateY(-100%)",
                          marginTop: "-5px",
                        }}
                      >
                        {task.title}
                      </div>
                    )}
                  </div>

                  {task?.description && (
                    <div className="relative">
                      <span
                        className="f-w-400 f-12 txt-close-icon l-h-20"
                        style={{
                          display: expandedTasks.has(task.id)
                            ? "inline"
                            : "-webkit-box",
                          WebkitLineClamp: expandedTasks.has(task.id)
                            ? "unset"
                            : 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textAlign: "justify",
                        }}
                      >
                        {task?.description}
                      </span>
                      {task?.description && task.description.length > 100 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskExpansion(task.id);
                          }}
                          className="ml-1 f-12 f-w-400 txt-blue-darken8 bg-transparent border-none cursor-pointer p-0 hover:underline"
                          style={{ display: "inline" }}
                        >
                          {expandedTasks.has(task.id)
                            ? "show less"
                            : "show more"}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="mt-8 d-flex">
                    <InsertCommentOutlinedIcon className="f-16 txt-grey-secondary mr-4" />
                    <p className="f-12 f-w-500 txt-grey-secondary">
                      {task?.commentCount}
                    </p>
                  </div>

                  <div className="mt-8 d-flex align-center justify-between">
                    <div>{getAssignTo(task.assignTo)}</div>
                    {task.dueDate && (
                      <div
                        className={`p-4 radius-4 f-12 f-w-600 ${
                          isDueExpired
                            ? "bg-error-lighten1 txt-error-dark1"
                            : "bg-blue-lighten9 txt-blue-darken10"
                        }`}
                      >
                        {timeConverter(task.dueDate)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <TableData tablesData={tablesData} workspaceId={workspaceId} />
    </>
  );
};

export default DashboardDetailsPage;
