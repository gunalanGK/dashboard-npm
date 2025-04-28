export declare const getCookie: (name: string) => [string, string];
export declare const deleteCookies: () => void;
export declare const mainNavigation: (baseUrl: string, path: string) => void;
export declare const setCookie: (name: string, cvalue: string, exdays: number) => void;
export declare const isDateTodayOrFuture: (dateString: string) => boolean;
export declare const getDateForTask: (dateStr: string) => string;
