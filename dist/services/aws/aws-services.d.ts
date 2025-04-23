/**
 * Authentication Functions
 *
 * This module exports functions for user authentication using AWS Amplify.
 * It configures Amplify with the provided AWS configuration and exports functions
 * for signing in, signing up, resetting passwords, confirming password resets,
 * resending sign-up codes, and fetching authentication sessions.
 */
import { signIn, signUp, resetPassword, confirmResetPassword, resendSignUpCode, confirmSignUp, updatePassword, signOut } from "aws-amplify/auth";
declare const _default: {
    signIn: typeof signIn;
    autoSignIn: import("@aws-amplify/auth/dist/esm/types/models").AutoSignInCallback;
    signUp: typeof signUp;
    fetchAuthSession: (options?: import("aws-amplify/auth").FetchAuthSessionOptions) => Promise<import("aws-amplify/auth").AuthSession>;
    resetPassword: typeof resetPassword;
    confirmResetPassword: typeof confirmResetPassword;
    resendSignUpCode: typeof resendSignUpCode;
    confirmSignUp: typeof confirmSignUp;
    updatePassword: typeof updatePassword;
    signOut: typeof signOut;
};
export default _default;
