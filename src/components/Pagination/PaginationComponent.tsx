import React from "react";

interface PaginationComponentProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ totalPages, currentPage, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="mt-20 flex justify-center">
            <div className="flex items-center gap-2">
                {currentPage > 1 && (
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-500 bg-white text-gray-700 hover:bg-gray-50"
                    >
                        ←
                    </button>
                )}

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const startPage = Math.max(1, currentPage - 2);
                    const page = startPage + i;
                    if (page > totalPages) return null;

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium ${
                                currentPage === page
                                    ? "border-primary-green bg-primary-green text-white"
                                    : "border-gray-500 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}

                {currentPage < totalPages && (
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-500 bg-white text-gray-700 hover:bg-gray-50"
                    >
                        →
                    </button>
                )}
            </div>
        </div>
    );
};

export default PaginationComponent;
