interface LoginFormValues {
    email: string;
    password: string;
}
export declare const useAuth: () => {
    login: (values: LoginFormValues) => Promise<void>;
    errorMessage: string | null;
};
export {};
