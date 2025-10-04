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
            <Alert variant={getVariant(error)} className="relative w-auto min-w-96 max-w-lg">
                <AlertTitle className="text-lg font-bold mb-4 pr-10">{getTitle(error)}</AlertTitle>
                <AlertDescription>
                    {error.message}
                    {error.statusCode && <span className="ml-2 text-sm opacity-75">(HTTP {error.statusCode})</span>}
                </AlertDescription>

                {/* Ikon gombok a jobb felső sarokban */}
                <div className="absolute right-3 top-3 flex gap-1">
                    {showRetryButton && onRetry && error.retryable && (
                        <Button
                            size="sm"
                            onClick={onRetry}
                            disabled={isRetrying}
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            title={isRetrying ? "Retrying..." : "Retry"}
                        >
                            <Image
                                src="/refresh.svg"
                                alt={isRetrying ? "Retrying..." : "Retry"}
                                width={16}
                                height={16}
                                className={isRetrying ? "animate-spin" : ""}
                            />
                        </Button>
                    )}
                    {onClose && (
                        <Button
                            size="sm"
                            onClick={onClose}
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            title="Close"
                        >
                            <Image src="/close.svg" alt="Close" width={16} height={16} />
                        </Button>
                    )}
                </div>
            </Alert>
        </div>
    );
};

export default ErrorDisplayComponent;
