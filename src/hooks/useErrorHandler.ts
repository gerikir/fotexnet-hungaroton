import { useState, useCallback } from "react";
import { ErrorState, AppError } from "../types/error";
import { ErrorHandler } from "../utils/errorHandler";

export const useErrorHandler = () => {
    const [errorState, setErrorState] = useState<ErrorState>({
        error: null,
        isRetrying: false,
        retryCount: 0,
    });

    const handleError = useCallback((error: unknown) => {
        const appError = ErrorHandler.createError(error);
        setErrorState({
            error: appError,
            isRetrying: false,
            retryCount: 0,
        });
    }, []);

    const clearError = useCallback(() => {
        setErrorState({
            error: null,
            isRetrying: false,
            retryCount: 0,
        });
    }, []);

    const retry = useCallback(
        async (retryFn: () => Promise<void>) => {
            if (!errorState.error || !ErrorHandler.shouldRetry(errorState.error, errorState.retryCount)) {
                return;
            }

            setErrorState((prev) => ({
                ...prev,
                isRetrying: true,
            }));

            try {
                await retryFn();
                clearError();
            } catch (error) {
                setErrorState((prev) => ({
                    error: ErrorHandler.createError(error),
                    isRetrying: false,
                    retryCount: prev.retryCount + 1,
                }));
            }
        },
        [errorState.error, errorState.retryCount, clearError],
    );

    return {
        errorState,
        handleError,
        clearError,
        retry,
        getErrorMessage: (error: AppError) => ErrorHandler.getErrorMessage(error),
    };
};
