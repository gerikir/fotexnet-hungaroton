export enum ErrorType {
    NETWORK = "NETWORK",
    SERVER = "SERVER",
    VALIDATION = "VALIDATION",
    UNKNOWN = "UNKNOWN",
}

export interface AppError {
    type: ErrorType;
    message: string;
    statusCode?: number;
    retryable: boolean;
}

export interface ErrorState {
    error: AppError | null;
    isRetrying: boolean;
    retryCount: number;
}
