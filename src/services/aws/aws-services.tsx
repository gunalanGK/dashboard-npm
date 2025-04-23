/**
 * Authentication Functions
 *
 * This module exports functions for user authentication using AWS Amplify.
 * It configures Amplify with the provided AWS configuration and exports functions
 * for signing in, signing up, resetting passwords, confirming password resets,
 * resending sign-up codes, and fetching authentication sessions.
 */

import { Amplify } from "aws-amplify";
import { CookieStorage } from "aws-amplify/utils";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";

import {
  fetchAuthSession,
  signIn,
  signUp,
  resetPassword,
  confirmResetPassword,
  resendSignUpCode,
  confirmSignUp,
  autoSignIn,
  updatePassword,
  signOut,
} from "aws-amplify/auth";
import awsConfig from "./aws-exports";

Amplify.configure(awsConfig);

// Set key-value storage using CookieStorage
cognitoUserPoolsTokenProvider.setKeyValueStorage(
  new CookieStorage({
    domain: 'localhost',
    secure: true,
    path: "/",
    expires: 30,
  })
);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  signIn,
  autoSignIn,
  signUp,
  fetchAuthSession,
  resetPassword,
  confirmResetPassword,
  resendSignUpCode,
  confirmSignUp,
  updatePassword,
  signOut,
};
