import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { formatPhoneNumber, getAgeFromDOB } from "@/utils/validators";
import { getMyPatient, patchPatient } from "@/services/patientServices";
import { getAllergies } from "@/services/allergyService";
import { getBloodType } from "@/services/bloodTypeService";
import EditPatientProfileForm from "@/components/EditPatientProfileForm";
import { Allergy, BloodType, PatchPatientRequest, Patient, PatientEditForm } from "@/types/patientTypes";

const emptyForm: PatientEditForm = {
  patientId: 0,
  address: "",
  age: "",
  dateOfBirth: "",
  gender: "other",
  phoneNumber: "",
  bloodType: "",
  allergyIds: [],
  noAllergies: false,
   drugAllergies:"",
};

type EditProfileLocationState = {
  patient?: Patient;
};

function toGender(value: string | null | undefined): "male" | "female" | "other" {
  switch ((value ?? "").toLowerCase()) {
    case "male":
      return "male";
    case "female":
      return "female";
    case "other":
      return "other";
    default:
      return "other";
  }
}

function EditPatientProfile() {
    const navigate = useNavigate();

	const location = useLocation();
	const patientFromState = (location.state as EditProfileLocationState | null)?.patient ?? null;

	const [patient, setPatient] = useState<Patient | null>(patientFromState);
	const [error, setError] = useState<string | null>(null);

	const [allergies, setAllergies] = useState<Allergy[]>([]);
	const [bloodTypes, setBloodTypes] = useState<BloodType[]>([]);

	const [form, setForm] = useState<PatientEditForm>(emptyForm);

	const [saving, setSaving] = useState(false);

	const didFetch = useRef(false);

	useEffect(() => {
		if (didFetch.current) return;
		didFetch.current = true;

		let cancelled = false;
	
		(async () => {
		  	try{
                console.log("Fetching allergies and blood types...");

				const [allergyData, bloodData] = await Promise.all([
					getAllergies(),
					getBloodType(),
				]);

				setAllergies(allergyData);
				setBloodTypes(bloodData);
				
		  	} catch (err) {
				console.error(err);
				if (!cancelled) setError("Failed to load Profile");
		  	}
		})();
		return () => {
      		cancelled = true;
    	};
	}, []);

	useEffect(() => {
		if (patient) return;

		(async () => {
			try {
				const p = await getMyPatient();
				setPatient(p);
			} catch (e) {
				console.error(e);
				setError("Failed to load patient");
			}
		})();
  	}, [patient]);

    useEffect(() => {
    	if (!patient) return;

		setForm({
			patientId: patient.patientId ?? 0,
			address: patient.address ?? "",
			age: patient.age != null ? String(patient.age) : "",
			dateOfBirth: patient.dateOfBirth ?? "",
			gender: toGender(patient.gender),
			phoneNumber: patient.phoneNumber ?? "",
			bloodType: patient.bloodType?.name ?? "",
			allergyIds: patient.allergies?.map((a) => a.allergyId) ?? [],
       noAllergies: patient.noAllergies ?? false,
      drugAllergies: patient.drugAllergies ?? "",
		});
  	}, [patient]);

	if (error) return <p className="text-red-600">{error}</p>;
	if (!patient) return <p>Loading information...</p>;

	const handleSave = async () => {
		const allergyPayload: string[] = allergies.filter((a) => form.allergyIds.includes(a.allergyId)).map((a) => a.name);
		
		const payload: PatchPatientRequest = {
			address: form.address,
			age: Number(form.age),
			allergies: allergyPayload,
			bloodType: form.bloodType,
			dateOfBirth: form.dateOfBirth,
			gender: form.gender,
			phoneNumber: form.phoneNumber,
      noAllergies: form.noAllergies,
      drugAllergies: form.drugAllergies,
		};
		
		console.log("PATCH payload", payload);

		await patchPatient(patient.patientId, payload);
	};

    const handleSubmit = async () => {
		try {
			setSaving(true);
            await handleSave();
            alert("Profile updated successfully!");
            navigate("/patient/profile");
        } catch (err){
			console.error(err);
			alert("Failed to update profile");
        } finally {
			setSaving(false);
		}
    };

    return (
        <EditPatientProfileForm
            value={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            saving={saving}
            allergies={allergies}
            bloodTypes={bloodTypes}
            onBack={() => navigate("/patient/profile")}
        />
    );
}

export default EditPatientProfile;