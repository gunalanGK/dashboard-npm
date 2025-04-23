const Config = {
    apiUrl: 'http://localhost:3000/api/crm/',
    clientApiUrl: 'http://localhost:3500/api/client/',
    tenantSocketUrl: 'http://localhost:3001/',
    clientSocketUrl: 'http://localhost:3001/',
    clientGraphqlUrl: 'http://localhost:3500/api/client/graphql',
    serverGraphqlUrl: 'http://localhost:3000/api/crm/graphql',
    notificationApiUrl: 'http://localhost:3000/api/notification/',
    // apiUrl: 'https://api.testin.doworks.com/api/crm/',
    // clientApiUrl: 'https://api.testin.doworks.com/api/client/',
    // tenantSocketUrl: 'https://api.testin.doworks.com/',
    // clientSocketUrl: 'https://api.testin.doworks.com/',
    // clientGraphqlUrl: 'https://api.testin.doworks.com/api/client/graphql',
    // serverGraphqlUrl: 'https://api.testin.doworks.com/api/crm/graphql',
    // notificationApiUrl: 'https://api.testin.doworks.com/api/notification/',
    // apiUrl: 'https://testin-crm-api.cloudmaxis.com/api/crm/',
    // clientApiUrl: 'https://testin-crm-api.cloudmaxis.com/api/client/',
    // tenantSocketUrl: 'https://testin-crm-api.cloudmaxis.com/',
    // apiUrl: 'https://stagein-crm-api.cloudmaxis.com/api/crm/',
    // clientApiUrl: 'https://stagein-crm-api.cloudmaxis.com/api/client/',
    // tenantSocketUrl: 'https://stagein-crm-api.cloudmaxis.com/',
    pattern: {
        emailValidation: /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,})+$/,
        webSiteValidation: /^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/,
        phoneNumberValidation: /^\+?(\d{1,3})?[-. ]?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/,
    },
};

export default Config;
