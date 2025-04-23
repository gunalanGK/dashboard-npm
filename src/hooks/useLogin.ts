import { useAuth } from "./useAuth";

export const useLogin = () => {
  const { login, errorMessage } = useAuth();

  const handleSubmit = (formData: any) => {
    // event.preventDefault();
    // const formData = new FormData(event.currentTarget);
    // const values = {
    //   email: formDat
    //   password: formData.get("password") as string,
    // };
    login(formData);
  };

  return {
    handleSubmit,
    errorMessage,
  };
};
