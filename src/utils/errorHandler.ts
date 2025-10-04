import { ErrorType, AppError } from "../types/error";

export class ErrorHandler {
    static createError(error: unknown): AppError {
        // console.error(`Error:`, error);

        if (error instanceof Error) {
            // Network errors
            if (error.message.includes("fetch")) {
                return {
                    type: ErrorType.NETWORK,
                    message: "Network error occurred. Please check your internet connection.",
                    retryable: true,
                };
            }

            // Generic error
            return {
                type: ErrorType.UNKNOWN,
                message: error.message || "An unknown error occurred.",
                retryable: false,
            };
        }

        // Response errors
        if (typeof error === "object" && error !== null && "status" in error) {
            const status = (error as { status: number }).status;

            if (status >= 500) {
                return {
                    type: ErrorType.SERVER,
                    message: "Server error occurred. Please try again later.",
                    statusCode: status,
                    retryable: true,
                };
            }

            if (status === 404) {
                return {
                    type: ErrorType.VALIDATION,
                    message: "The requested resource was not found.",
                    statusCode: status,
                    retryable: false,
                };
            }

            return {
                type: ErrorType.VALIDATION,
                message: `HTTP error: ${status}`,
                statusCode: status,
                retryable: status >= 500,
            };
        }

        return {
            type: ErrorType.UNKNOWN,
            message: "An unknown error occurred.",
            retryable: false,
        };
    }

    static getErrorMessage(error: AppError): string {
        switch (error.type) {
            case ErrorType.NETWORK:
                return "Network connection problem. Please check your internet connection and try again.";
            case ErrorType.SERVER:
                return "Server error occurred. Please try again later.";
            case ErrorType.VALIDATION:
                return error.message;
            case ErrorType.UNKNOWN:
            default:
                return "An unexpected error occurred. Please try again.";
        }
    }

    static shouldRetry(error: AppError, retryCount: number, maxRetries: number = 3): boolean {
        return error.retryable && retryCount < maxRetries;
    }
}
