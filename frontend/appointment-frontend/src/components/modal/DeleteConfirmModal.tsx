import React from "react";
import { User } from "@/types/superTypes";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    user: User | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    user,
}) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/75 bg-opacity-50 transition-opacity"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative w-full max-w-sm transform rounded-lg bg-white shadow-xl transition-all">
                    <div className="p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            Delete User
                        </h3>

                        <p className="text-sm text-gray-500 text-center mb-6">
                            Are you sure you want to delete{' '}
                            <span className="font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};