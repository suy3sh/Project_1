import { useNavigate } from "react-router-dom";
import { useState } from "react";

function EditPatientProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "Jane Smith",
    age: 23,
    bloodGroup: "O+",
    address: "123 Green Street, New York",
    allergies: "Peanuts",
    medicalHistory: "No chronic illness",
    lifestyle: "Vegetarian, exercises regularly",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    // For now just navigate back
    // (Later you can connect this to backend)
    navigate("/patient/profile");
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">

         {/* Back link */}
      <button
        onClick={() => navigate("/patient/profile")}
        className="mb-4 text-indigo-600 hover:underline"
      >
        ← Back to Profile
      </button>
      <h2 className="text-2xl font-bold mb-6">Edit Patient Profile</h2>

      <Input label="Name" name="name" value={form.name} onChange={handleChange} />
      <Input label="Age" name="age" value={form.age} onChange={handleChange} />
      <Input
        label="Blood Group"
        name="bloodGroup"
        value={form.bloodGroup}
        onChange={handleChange}
      />
      <Input
        label="Address"
        name="address"
        value={form.address}
        onChange={handleChange}
      />
      <Input
        label="Allergies"
        name="allergies"
        value={form.allergies}
        onChange={handleChange}
      />
      <Input
        label="Medical History"
        name="medicalHistory"
        value={form.medicalHistory}
        onChange={handleChange}
      />
      <Input
        label="Other Details"
        name="lifestyle"
        value={form.lifestyle}
        onChange={handleChange}
      />

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => navigate("/patient/profile")}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        {...props}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
}

export default EditPatientProfile;

