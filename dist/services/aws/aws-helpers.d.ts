import { ResetPasswordOutput, UpdatePasswordInput } from 'aws-amplify/auth';
/**
 * Function to update the user password.
 * @param {UpdatePasswordInput} oldPassword - The old password of the user.
 * @param {UpdatePasswordInput} newPassword - The new password of the user.
 * @returns {Promise<void>} A Promise representing the completion of the password update operation.
 */
export declare const handleUpdatePassword: ({ oldPassword, newPassword }: UpdatePasswordInput) => Promise<"error" | "success">;
/**
 * Function to handle next steps after resetting the password.
 * @param {ResetPasswordOutput} output - The output object from resetting the password.
 */
export declare function handleResetPasswordNextSteps(output: ResetPasswordOutput): void;
/**
 * Function to resend OTP (One Time Password) for resetting the password.
 * @param {string} username - The username or email of the user for whom OTP is to be resent.
 * @returns {Promise<void>} A Promise representing the completion of the OTP resend operation.
 */
export declare const resendOtp: (username: string) => Promise<void>;
export declare function handleSignOut(): Promise<void>;
export declare function handleSignOutAllDevices(): Promise<void>;
