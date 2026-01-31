import { formatPhoneNumber } from "@/utils/validators";
import { Allergy, BloodType, PatientDetailsForm } from "@/types/patientTypes";
import { useState } from "react";

type Props = {
    value: PatientDetailsForm;
    onChange: (next: PatientDetailsForm) => void;
    onSubmit: () => void | Promise<void>;

    allergies: Allergy[];
    bloodTypes: BloodType[];
}

export default function RegisterForm2({value, onChange, onSubmit, allergies, bloodTypes}: Props){

    const [error, setError] = useState<String | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        
        const { name, value: inputValue } = e.target;

        if (name === "phoneNumber") {
            onChange({
                ...value,
                phoneNumber: formatPhoneNumber(inputValue),
            });
            return;
        }
        
        onChange({
            ...value,
            [name]: inputValue,
        });
    };

    const toggleAllergy = (id: number) => {
        const nextIds = value.allergyIds.includes(id) ? value.allergyIds.filter((x) => x !== id) : [...value.allergyIds, id];
    
        onChange({
            ...value,
            allergyIds: nextIds,
        });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!value.dateOfBirth || !value.phoneNumber || !value.address || !value.bloodType) {
            setError("Please fill all fields");
            return;
        }

        try {
            await onSubmit();
        } catch {
            setError("Registration failed. Please try again.");
        }
       
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                {/* Title */}
                <h1 className="text-3xl font-bold text-center text-purple-700">
                    Patient Details
                </h1>
                <p className="text-center text-gray-500 mt-2">
                    Step 2 of 2: Add your information
                </p>

                <form onSubmit={handleSubmit} className="mt-8 spacy-y-5">
                    

                    <div className="mb-2">
                        <label className="block text-sm mb-1 text-gray-600">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={value.dateOfBirth}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 
                                        focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm mb-1 text-gray-600">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={value.gender}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 
                                        focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm mb-1 text-gray-600">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={value.phoneNumber}
                            onChange={handleChange}
                            placeholder="(555) 555-5555"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 
                                        focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm mb-1 text-gray-600">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={value.address}
                            onChange={handleChange}
                            placeholder="Street, City, State"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 
                                        focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm mb-1 text-gray-600">
                            Blood Type
                        </label>
                        <select
                            name="bloodType"
                            value={value.bloodType}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 
                                        focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="">Select blood type</option>
                            {(bloodTypes ?? []).map((bt) => (
                                <option key={bt.bloodTypeId} value={String(bt.name)}>
                                {bt.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <p className="block text-sm mb-1 text-gray-600">
                        Allergies (optional)
                        </p>

                        <div className="w-full rounded-lg border border-gray-300 px-4 py-2 
                                        focus:outline-none focus:ring-2 focus:ring-purple-400 max-h-40 overflow-auto space-y-2 pr-1">
                        {allergies.map((a) => (
                            <label key={a.allergyId} className="flex items-center gap-2 text-gray-700">
                            <input
                                type="checkbox"
                                checked={value.allergyIds.includes(a.allergyId)}
                                onChange={() => toggleAllergy(a.allergyId)}
                            />
                            {a.name}
                            </label>
                        ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="flex-1 bg-purple-600 hover:bg-purple-700 transition py-2 rounded-lg font-semibold text-white"
                        >
                            Register
                        </button>
                    </div>

                    <div className="flex justify-center">
                        {error && (
                            <div className="rounded-xl border border-red-200 font-medium bg-red-50 p-3 text-sm text-red-700 text-center">
                            {error}
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

