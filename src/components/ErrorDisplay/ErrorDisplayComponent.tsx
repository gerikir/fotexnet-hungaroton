import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
    const getVariant = (error: AppError): "default" | "destructive" => {
        switch (error.type) {
            case "NETWORK":
                return "default";
            case "SERVER":
                return "destructive";
            case "VALIDATION":
                return "default";
            default:
                return "destructive";
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
        <div className="my-8 flex justify-center">
            <Alert variant={getVariant(error)} className="w-auto max-w-md">
                <AlertTitle>{getTitle(error)}</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                    <div>
                        {error.message}
                        {error.statusCode && <span className="ml-2 text-sm opacity-75">(HTTP {error.statusCode})</span>}
                    </div>
                    <div className="flex gap-2">
                        {showRetryButton && onRetry && error.retryable && (
                            <Button
                                size="sm"
                                onClick={onRetry}
                                disabled={isRetrying}
                                variant="outline"
                                className="flex w-20 items-center gap-1 text-gray-500"
                            >
                                <Image src="/refresh.svg" alt="Refresh" width={16} height={16} />
                                {isRetrying ? "Retrying..." : "Retry"}
                            </Button>
                        )}
                        {onClose && (
                            <Button
                                size="sm"
                                onClick={onClose}
                                variant="outline"
                                className="flex w-20 items-center gap-1 text-gray-500"
                            >
                                <Image src="/close.svg" alt="Close" width={16} height={16} />
                                Close
                            </Button>
                        )}
                    </div>
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default ErrorDisplayComponent;
