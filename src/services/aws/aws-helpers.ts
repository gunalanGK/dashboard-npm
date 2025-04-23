import { ResetPasswordOutput, UpdatePasswordInput } from 'aws-amplify/auth';
import amplifyService from './aws-services';

/**
 * Function to update the user password.
 * @param {UpdatePasswordInput} oldPassword - The old password of the user.
 * @param {UpdatePasswordInput} newPassword - The new password of the user.
 * @returns {Promise<void>} A Promise representing the completion of the password update operation.
 */
export const handleUpdatePassword = async ({ oldPassword, newPassword }: UpdatePasswordInput) => {
	try {
		await amplifyService.updatePassword({ oldPassword, newPassword });
		return 'success';
	} catch (err) {
		console.log(err, 'findmehere');
		return 'error';
	}
};

/**
 * Function to handle next steps after resetting the password.
 * @param {ResetPasswordOutput} output - The output object from resetting the password.
 */
export function handleResetPasswordNextSteps(output: ResetPasswordOutput) {
	const { nextStep } = output;
	switch (nextStep.resetPasswordStep) {
		case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
			const codeDeliveryDetails = nextStep.codeDeliveryDetails;
			break;
		case 'DONE':
			console.log('Successfully reset password.');
			break;
	}
}

/**
 * Function to resend OTP (One Time Password) for resetting the password.
 * @param {string} username - The username or email of the user for whom OTP is to be resent.
 * @returns {Promise<void>} A Promise representing the completion of the OTP resend operation.
 */
export const resendOtp = async (username: string) => {
	try {
		await amplifyService.resetPassword({
			username: username,
		});
	} catch (error) {
		console.log(error, 'findmehere');
	}
};

// Logout - use this for logout
export async function handleSignOut() {
	try {
		await amplifyService.signOut();
	} catch (error) {
		console.log('error signing out: ', error);
	}
}

// Helps to logout the user from all the logged devices
export async function handleSignOutAllDevices() {
	try {
		await amplifyService.signOut({ global: true });
	} catch (error) {
		throw new Error('Error signing out');
	}
}
