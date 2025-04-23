import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  tenantId: string | null;
  setAccessToken: (token: string) => void;
  setTenantId: (id: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  tenantId: null,

  setAccessToken: (token) => set({ accessToken: token }),
  setTenantId: (id) => set({ tenantId: id }),

  logout: () => set({ accessToken: null, tenantId: null }),
}));

export default useAuthStore;
