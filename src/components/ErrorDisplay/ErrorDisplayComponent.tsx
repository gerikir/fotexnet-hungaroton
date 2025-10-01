import React from "react";
import { Alert, AlertTitle, Button, Box } from "@mui/material";
import { AppError } from "../../types/error";
import Image from "next/image";

interface ErrorDisplayProps {
    error: AppError;
    isRetrying?: boolean;
    onRetry?: () => void;
    onClose?: () => void;
    showRetryButton?: boolean;
}

const ErrorDisplayComponent: React.FC<ErrorDisplayProps> = ({
    error,
    isRetrying = false,
    onRetry,
    onClose,
    showRetryButton = true,
}) => {
    const getSeverity = (error: AppError): "error" | "warning" | "info" => {
        switch (error.type) {
            case "NETWORK":
                return "warning";
            case "SERVER":
                return "error";
            case "VALIDATION":
                return "info";
            default:
                return "error";
        }
    };

    const getTitle = (error: AppError): string => {
        switch (error.type) {
            case "NETWORK":
                return "Network Error";
            case "SERVER":
                return "Server Error";
            case "VALIDATION":
                return "Validation Error";
            default:
                return "Error Occurred";
        }
    };

    return (
        <Box className="my-8 flex justify-center">
            <Alert
                severity={getSeverity(error)}
                className="w-auto max-w-md"
                action={
                    <Box className="flex gap-2">
                        {showRetryButton && onRetry && error.retryable && (
                            <Button
                                size="small"
                                onClick={onRetry}
                                disabled={isRetrying}
                                variant="text"
                                className="flex w-20 items-center gap-1 !text-gray-500"
                            >
                                <Image src="/refresh.svg" alt="Refresh" width={16} height={16} />
                                {isRetrying ? "Retrying..." : "Retry"}
                            </Button>
                        )}
                        {onClose && (
                            <Button
                                size="small"
                                onClick={onClose}
                                variant="text"
                                className="flex w-20 items-center gap-1 !text-gray-500"
                            >
                                <Image src="/close.svg" alt="Close" width={16} height={16} />
                                Close
                            </Button>
                        )}
                    </Box>
                }
            >
                <AlertTitle>{getTitle(error)}</AlertTitle>
                {error.message}
                {error.statusCode && (
                    <Box component="span" className="ml-2 text-sm opacity-75">
                        (HTTP {error.statusCode})
                    </Box>
                )}
            </Alert>
        </Box>
    );
};

export default ErrorDisplayComponent;
