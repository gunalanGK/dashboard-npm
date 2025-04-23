declare const Config: {
    apiUrl: string;
    clientApiUrl: string;
    tenantSocketUrl: string;
    clientSocketUrl: string;
    clientGraphqlUrl: string;
    serverGraphqlUrl: string;
    notificationApiUrl: string;
    pattern: {
        emailValidation: RegExp;
        webSiteValidation: RegExp;
        phoneNumberValidation: RegExp;
    };
};
export default Config;
