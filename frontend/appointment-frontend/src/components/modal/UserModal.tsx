import React, { useState, useEffect } from "react";
import { User, Privilege, Speciality, CreateUserPayload } from "@/types/superTypes";
import { getSpecialities } from "@/services/superService";
import { XMarkIcon } from "@heroicons/react/24/outline";

type UserFormData = CreateUserPayload & {
    confirmPassword?: string;
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateUserPayload) => void;
    user?: User | null;
    initialPrivilege?: Privilege;
}

export const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    user,
    initialPrivilege
}) => {
    const [formData, setFormData] = useState<UserFormData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        privilege: initialPrivilege || "Doctor",
        speciality: "",
        gender: "other",
        experience: 0,
        bio: ""
    });

    const [specialities, setSpecialities] = useState<Speciality[]>([]);
    const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password || "",
                privilege: user.privilege,
                speciality: user.speciality || "",
                gender: user.gender,
                experience: user.experience,
                bio: user.bio
            });
        } else {
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                privilege: initialPrivilege || "Doctor",
                speciality: "",
                experience: 0,
                gender: "other",
                bio: "",
            });
        }
        setErrors({});
    }, [user, initialPrivilege, isOpen]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const specialityData = await getSpecialities();
        
                if (!cancelled) {
                    setSpecialities(specialityData);
                }
            } catch (err) {
                console.error(err);
            }
        })();

        return () => {
            cancelled = true;
        }
    }, []);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof UserFormData, string>> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if(!user && !formData.password.trim()) {
            newErrors.password = 'Password is required';
        }
        if(!user && !formData.confirmPassword?.trim()) {
            newErrors.confirmPassword = "Please confirm your password";
        }
        if(!user && formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        if (formData.privilege === 'Doctor') {
            if (!formData.speciality) {
                newErrors.speciality = 'Speciality is required for doctors';
            }
            if (!formData.experience) {
                newErrors.experience = 'Years of Experience is required for doctors';
            }
            if (!formData.gender) {
                newErrors.experience = 'Gender is required for doctors';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) {
            const { confirmPassword, ...payload } = formData;
            onSubmit(payload);
            onClose();
        }
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/75 bg-opacity-50 transition-opacity"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {user ? 'Edit User' : 'Create New User'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                        {/* First Name */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.email ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password only when creating new user */}
                        {!user && (
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.password ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>
                        )}

                        {!user && (
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>
                        )}
                        

                        {/* Privilege */}
                        <div>
                            <label htmlFor="privilege" className="block text-sm font-medium text-gray-700 mb-1">
                                Privilege
                            </label>
                            <select
                                id="privilege"
                                value={formData.privilege}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        privilege: e.target.value as Privilege,
                                        speciality: e.target.value !== "Doctor" ? "" : formData.speciality,
                                    })
                                }
                                disabled={ user ? true : false }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="Doctor">Doctor</option>
                                <option value="Admin">Admin</option>
                                <option value="Super">Super User</option>
                            </select>
                        </div>

                        {/* Speciality (only for doctors) */}
                        {formData.privilege === "Doctor" && (
                            <div>
                                <label htmlFor="speciality" className="block text-sm font-medium text-gray-700 mb-1">
                                    Speciality
                                </label>
                                <select
                                    id="speciality"
                                    value={formData.speciality}
                                    onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.speciality ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select a speciality</option>
                                    {specialities.map((speciality) => (
                                        <option key={speciality.id} value={speciality.name}>
                                            {speciality.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.speciality && (
                                    <p className="mt-1 text-sm text-red-600">{errors.speciality}</p>
                                )}
                            </div>
                        )}

                        {/* Years of Experience (only for doctors) */}
                        {formData.privilege === "Doctor" && (
                            <div>
                                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                                    Years of Experience
                                </label>
                                <input
                                    type="number"
                                    id="experience"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value)})}
                                    min={1}
                                    step={1}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.experience ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                {errors.experience && (
                                    <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                                )}
                            </div>
                        )}

                        {/* Gender (only for doctors) */ }
                        {formData.privilege === "Doctor" && (
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" | "other"})}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.gender ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select a gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && (
                                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                                )}
                            </div>
                        )}

                        {/* Bio (only for doctors) */}
                        {formData.privilege === "Doctor" && (
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                    Bio
                                </label>
                                <input
                                    type="textarea"
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.bio ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                />
                                {errors.bio && (
                                    <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                {user ? 'Save Changes' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};