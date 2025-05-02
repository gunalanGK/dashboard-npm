export const DashboardTemplateName = {
  "Basic Crm": "basicCrm",
  "Portfolio Management": "portfolioManagement",
  "Construction Planning": "constructionPlanning",
  "Resource Management": "resourceManagement",
  "Task Management": "taskManagement",
  "Project Management": "projectManagement",
};

export const DashboardTemplate: any = {
  ["basicCrm"]: {
    rawDataCards: [
      {
        metric: "No. of deals",
        column: "deal_name",
        table: "deals",
        dax_function: "distinct_count()",
      },
      {
        metric: "Unique Lead Sources",
        column: "lead_source",
        table: "contacts",
        dax_function: "distinct_count()",
      },
      {
        metric: "Unique Sales Stages",
        column: "stage",
        table: "contacts",
        dax_function: "distinct_count()",
      },
      {
        metric: "Total Companies Engaged",
        column: "company_name",
        table: "companies",
        dax_function: "distinct_count()",
      },
    ],
    SuggestedPlots: [
      {
        plot_type: "doughnut",
        values: "count(company_name)",
        xtable: "companies",
        group_by: {
          column: "company_name",
          table: "companies",
          axis: "labels",
        },
        description: "Proportion of companies by name",
        plot_name: "Company Name Distribution",
        "label-values": "Company Name",
      },
      {
        plot_type: "bar",
        "x-axis": "country",
        "y-axis": "count(country)",
        xtable: "contacts",
        ytable: "contacts",
        group_by: {
          column: "country",
          table: "contacts",
          axis: "x-axis",
        },
        description: "Number of contacts grouped by country",
        plot_name: "Contact Count by Country",
        "label-yaxis": "Number of Contacts",
        "label-xaxis": "Country",
      },
      {
        plot_type: "histogram",
        "x-axis": "stage",
        "y-axis": "count(stage)",
        xtable: "contacts",
        ytable: "contacts",
        group_by: {
          column: "stage",
          table: "contacts",
          axis: "x-axis",
        },
        description: "Number of contacts grouped by country",
        plot_name: "Distribution by Stage",
        "label-yaxis": "Number of Contacts",
        "label-xaxis": "Country",
      },
      {
        plot_type: "line",
        "x-axis": "created_at",
        "y-axis": "amount",
        xtable: "deals",
        ytable: "deals",
        group_by: {
          column: "amount",
          table: "deals",
          axis: "x-axis",
        },
        description:
          "Visualizes how initial investments have varied across company creation dates.",
        plot_name: "Initial Investment Over Time",
        "label-yaxis": "Initial Amount (USD)",
        "label-xaxis": "Company Creation Date",
      },
      {
        plot_type: "area",
        "x-axis": "created_at",
        "y-axis": "amount",
        xtable: "deals",
        ytable: "deals",
        group_by: {
          column: "amount",
          table: "deals",
          axis: "x-axis",
        },
        description:
          "Visualizes how initial investments have varied across company creation dates.",
        plot_name: "Initial Investment Over Time",
        "label-yaxis": "Initial Amount (USD)",
        "label-xaxis": "Company Creation Date",
      },
      {
        plot_type: "pie",
        values: "count(is_active)",
        xtable: "contacts",
        group_by: {
          column: "is_active",
          table: "contacts",
          axis: "labels",
        },
        description: "Distribution of contacts by active status",
        plot_name: "Contact Activity Status",
        "label-values": "Is Active",
      },
    ],
  },
};
