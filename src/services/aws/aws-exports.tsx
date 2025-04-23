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
  
  const awsConfig: { Auth: { Cognito: AwsAuthConfig } } = {
    Auth: {
      Cognito: {
        userPoolId: "ap-south-1_es4yWY1O9",
        userPoolClientId: "7hte1nkjug6rqsf9air6021aqr",
        userPoolEndpoint: "https://cognito-idp.ap-south-1.amazonaws.com/",
      },
    },
  };
  
  export default awsConfig;
  