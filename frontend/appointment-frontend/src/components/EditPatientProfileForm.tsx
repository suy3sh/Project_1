import { Allergy, BloodType, PatientEditForm } from "@/types/patientTypes";
import { formatPhoneNumber, getAgeFromDOB } from "@/utils/validators";
import { useState } from "react";

type Props = {
  value: PatientEditForm;
  onChange: (next: PatientEditForm) => void;
  onSubmit: () => void | Promise<void>;
  saving: boolean;
  allergies: Allergy[];
  bloodTypes: BloodType[];
  onBack: () => void;
};

export default function EditPatientProfileForm({
  value,
  onChange,
  onSubmit,
  saving,
  allergies,
  bloodTypes,
  onBack,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value: inputValue } = e.target;

    if (name === "phoneNumber") {
      onChange({ ...value, phoneNumber: formatPhoneNumber(inputValue) });
      return;
    }

export default function EditPatientProfileForm({value, onChange, onSubmit, saving, allergies, bloodTypes, onBack}: Props){
    const [error, setError] = useState<String>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value: inputValue } = e.target;

  const handleAllergyToggle = (id: number) => {
    const nextIds = value.allergyIds.includes(id)
      ? value.allergyIds.filter((x) => x !== id)
      : [...value.allergyIds, id];

    onChange({ ...value, allergyIds: nextIds });
  };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!value.dateOfBirth || !value.phoneNumber || !value.address || !value.bloodType) {
            setError("Please fill all fields");
            return;
        }


    if (computedAge !== enteredAge) {
      alert(`Age and DOB do not match. Based on DOB, age should be ${computedAge}`);
      return;
    }

    await onSubmit();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={onBack} className="mb-4 text-indigo-600 hover:underline">
        ← Back to Profile
      </button>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

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
                        {(bloodTypes ?? []).map((bt) => (
                            <option key={bt.bloodTypeId} value={String(bt.name)}>
                            {bt.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <p className="block text-sm mb-1 text-gray-600">
                    Allergies
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
                        {/* )} */}
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 transition py-2 rounded-lg font-semibold text-white"
                    >
                        {saving ? "Updating..." : "Update Profile"}
                    </button>
                </div>

                
                    {error && (
                        <div className="rounded-xl border border-red-200 font-medium bg-red-50 p-3 text-sm text-red-700 text-center">
                        {error}
                        </div>
                    )}
                
                
            </form>
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm mb-1 text-gray-600">Date of Birth</label>
          <input type="date" name="dateOfBirth" value={value.dateOfBirth} onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"/>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm mb-1 text-gray-600">Gender</label>
          <select name="gender" value={value.gender} onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm mb-1 text-gray-600">Phone Number</label>
          <input type="tel" name="phoneNumber" value={value.phoneNumber} onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"/>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm mb-1 text-gray-600">Address</label>
          <input type="text" name="address" value={value.address} onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"/>
        </div>

        {/* Blood Type */}
        <div>
          <label className="block text-sm mb-1 text-gray-600">Blood Type</label>
          <select name="bloodType" value={value.bloodType} onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400">
            {bloodTypes.map(bt => (
              <option key={bt.bloodTypeId} value={bt.name}>{bt.name}</option>
            ))}
          </select>
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-sm mb-1 text-gray-600">Allergies</label>

          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" checked={value.noAllergies}
              onChange={(e) => onChange({ ...value, noAllergies: e.target.checked })}/>
            No Allergies
          </label>

          <div className="w-full rounded-lg border border-gray-300 px-4 py-2 max-h-40 overflow-auto space-y-2 pr-1">
            {allergies.map(a => (
              <label key={a.allergyId} className="flex items-center gap-2 text-gray-700">
                <input type="checkbox"
                  checked={value.allergyIds.includes(a.allergyId)}
                  disabled={value.noAllergies}
                  onChange={() => handleAllergyToggle(a.allergyId)} />
                {a.name}
              </label>
            ))}
          </div>

          {/* Drug Allergies */}
          <div className="mt-2">
            <label className="block text-sm mb-1 text-gray-600">Drug Allergies</label>
            <input type="text" name="drugAllergies" value={value.drugAllergies}
              onChange={(e) => onChange({ ...value, drugAllergies: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"/>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 bg-purple-600 hover:bg-purple-700 transition py-2 rounded-lg font-semibold text-white">
            {saving ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
