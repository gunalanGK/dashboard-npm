/*  */const useLogout = () => {
  const deleteAllCookies = (): void => {
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = `${cookie
        .split("=")[0]
        .trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
  };

  const handleLogout = (): void => {
    localStorage.clear();
    deleteAllCookies();
  };

  return { handleLogout };
};

export default useLogout;
