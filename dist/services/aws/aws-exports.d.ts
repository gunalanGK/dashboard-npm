/**
 * AWS Amplify Configuration for Authentication
 *
 * This module configures AWS Amplify for authentication using Amazon Cognito.
 * It specifies the user pool settings required for authentication.
 */
export interface AwsAuthConfig {
    userPoolId: string;
    userPoolClientId: string;
    userPoolEndpoint: string;
}
declare const awsConfig: {
    Auth: {
        Cognito: AwsAuthConfig;
    };
};
export default awsConfig;
