import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DashboardTemplateType {
  loading: boolean;
  dashboardTemplateList: any[] | null;
  error: string | null;
  updateLoading: () => void;
  updateDashboardTemplateList: (dataList: unknown) => void;
  updateError: (error: string) => void;
}

export const useDashboardTemplateStore = create<DashboardTemplateType>()(
  devtools((set) => ({
    loading: false,
    dashboardTemplateList: [],
    error: null,
    updateLoading: () =>
      set((state: DashboardTemplateType) => ({ ...state, loading: true })),
    updateDashboardTemplateList: (templateList: any) =>
      set((state: DashboardTemplateType) => ({
        ...state,
        dashboardTemplateList: templateList,
        loading: false,
      })),
    updateError: (error: string) => set((state) => ({ ...state, error })),
  }))
);
