import React from "react";
import { User } from "@/types/superTypes";
import { PrivilegeBadge } from "./PrivilegeBadge";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
    return (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                            Full Name
                        </th>
                        <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                            Email
                        </th>
                        <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                            Privilege
                        </th>
                        <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                            Speciality
                        </th>
                        <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {users.map((user) => (
                        <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {user.privilege === "Doctor" ? "Dr." : ""} {user.firstName} {user.lastName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {user.email}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <PrivilegeBadge privilege={user.privilege} />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {user.privilege === "Doctor" ? user.speciality : "—"}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                        title="Edit user"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(user)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        title="Delete user"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-3 py-8 text-center text-sm text-gray-500">
                                No users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};