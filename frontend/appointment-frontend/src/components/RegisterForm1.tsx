import { useNavigate } from "react-router-dom";
import { RegisterUserForm } from "../types/userTypes";
import { useState } from "react";

type Props = {
    value: RegisterUserForm;
    onChange: (next: RegisterUserForm) => void;
    onNext: () => void;
}

export default function RegisterForm1({value, onChange, onNext}: Props) {
    const navigate = useNavigate();
    const [error, setError] = useState<String>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            ...value,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //Basic Validation
        if (!value.firstName || !value.lastName || !value.email || !value.password) {
            setError("Please fill all fields");
            return;
        }

        console.log("Registration Step 1: ", value);

        try {
            await onNext();
        } catch {
            setError("Registration failed. Please try again.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                {/* Title */}
                <h1 className="text-3xl font-bold text-center text-purple-700">
                    Patient Registration
                </h1>
                <p className="text-center text-gray-500 mt-2">
                    Step 1 of 2: Create your Smart Appointment Account
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className="block text-sm mb-1 text-gray-600">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={value.firstName}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-gray-600">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={value.lastName}
                            onChange={handleChange}
                            placeholder="Enter last name"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={value.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 
                                        focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={value.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 
                                        focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 
                                transition py-2 rounded-lg font-semibold text-white"
                    >
                        Continue
                    </button>

                    <div className="flex justify-center">
                        {error && (
                            <div className="rounded-xl border border-red-200 font-medium bg-red-50 p-3 text-sm text-red-700 text-center">
                            {error}
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <span
                        className="text-purple-600 font-medium cursor-pointer hover:underline"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    )

    
}