export interface DashboardPageProps {
    payload: {
      host: string;
      user: string;
      password: string;
      database: string;
      port: number;
    };
    loginData: {
      email: string;
      password: string;
    };
  }
  