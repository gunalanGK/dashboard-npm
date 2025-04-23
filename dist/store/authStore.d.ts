interface AuthState {
    accessToken: string | null;
    tenantId: string | null;
    setAccessToken: (token: string) => void;
    setTenantId: (id: string) => void;
    logout: () => void;
}
declare const useAuthStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AuthState>>;
export default useAuthStore;
