import React, { useState, useEffect } from 'react';
import { User, Privilege, CreateUserPayload } from '../../types/superTypes';
import { RegisterResponse, Privilege as FullPrivilege } from '../../types/userTypes';
import { UserTable } from '../../components/UserTable';
import { CreateUserDropdown } from '../../components/CreateUserDropdown';
import { UserModal } from '../../components/modal/UserModal';
import { DeleteConfirmModal } from '../../components/modal/DeleteConfirmModal';
import { deleteUser, getUsersForTable, patchDoctor, patchUser, registerUser } from '@/services/superService';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';

const SuperHome: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [initialPrivilege, setInitialPrivilege] = useState<Privilege>("Doctor");
    const [error, setError] = useState<String>();

    useEffect(() => {
        let cancelled = false;
    
        (async () => {
            try {
                const userData = await getUsersForTable();
            
                if (!cancelled) {
                    setUsers(userData);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load users")
            }
        })();
    
        return () => {
            cancelled = true;
        }
    }, []);

    const handleCreateUser = (privilege: Privilege) => {
        setSelectedUser(null);
        setInitialPrivilege(privilege);
        setIsUserModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
    };

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleUserSubmit = async (data: CreateUserPayload) => {
        try {
            if (selectedUser) {
                // Edit existing user
                let updatedUser: User | undefined = undefined;

                updatedUser = await patchUser(selectedUser.userId, data);

                if (selectedUser.privilege === "Doctor") {
                    await patchDoctor(selectedUser.userId, data);
                    updatedUser = { ...selectedUser, ...data };
                }

                setUsers((prev) =>
                    prev.map((u) => (u.userId === selectedUser.userId ? { ...u, ...data } : u ))
                );
            } else {
                // Create new user
                const created: RegisterResponse = await registerUser(data);

                if (data.privilege === "Doctor") {
                    const doctorUpdate = await patchDoctor(created.userId, data);
                    
                    const newUser: User = {
                        userId: created.userId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: created.email,
                        privilege: data.privilege,
                        speciality: doctorUpdate.speciality.specialityName,
                        gender: doctorUpdate.gender,
                        experience: doctorUpdate.experience,
                        bio: doctorUpdate.bio
                    };

                    setUsers((prev) => [...prev, newUser]);
                } else {
                    const newUser: User = {
                        userId: created.userId, 
                        firstName: data.firstName, 
                        lastName: data.lastName, 
                        email: created.email, 
                        privilege: data.privilege
                    }
                    setUsers((prev) => [...prev, newUser]);
                }
            }

            setIsUserModalOpen(false);
            setSelectedUser(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            if (selectedUser) {
                await deleteUser(selectedUser.userId);
                setUsers((prev) => prev.filter((u) => u.userId !== selectedUser.userId));
            }
        
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
        } catch (err) {
            console.error(err)
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Super User Dashboard
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Manage doctors, admins, and super users
                                </p>
                            </div>
                        </div>
                        <CreateUserDropdown onSelect={handleCreateUser} />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Doctors</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {users.filter((u) => u.privilege === 'Doctor').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-amber-100 rounded-lg">
                                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Admins</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {users.filter((u) => u.privilege === 'Admin').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Super Users</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {users.filter((u) => u.privilege === 'Super').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
                        <p className="text-sm text-gray-500">
                            {users.length} user{users.length !== 1 ? 's' : ''} total
                        </p>
                    </div>
                    {error && (
                        <div className="rounded-xl border border-red-200 font-medium bg-red-50 p-3 text-sm text-red-700 text-center">
                            {error}
                        </div>
                    )}
                    <UserTable
                        users={users}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                    />
                </div>
            </main>

            {/* Modals */}
            <UserModal
                isOpen={isUserModalOpen}
                onClose={() => {
                    setIsUserModalOpen(false);
                    setSelectedUser(null);
                }}
                onSubmit={handleUserSubmit}
                user={selectedUser}
                initialPrivilege={initialPrivilege}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedUser(null);
                }}
                onConfirm={handleDeleteConfirm}
                user={selectedUser}
            />
        </div>
    );
};

export default SuperHome;