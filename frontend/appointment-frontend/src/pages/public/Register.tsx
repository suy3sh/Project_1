import { useEffect, useRef, useState } from "react";
import RegisterForm1 from "../../components/RegisterForm1";
import RegisterForm2 from "../../components/RegisterForm2";
import { register, login as loginAPI} from "../../services/authService";
import { patchPatient } from "@/services/patientServices";
import { setTokenGetter } from "@/services/http";
import { getAllergies } from "@/services/allergyService";
import { getBloodType } from "@/services/bloodTypeService";
import { Allergy, BloodType, PatchPatientRequest, PatientDetailsForm } from "@/types/patientTypes";
import { RegisterUserForm } from "@/types/userTypes";
import { getAgeFromDOB } from "@/utils/validators";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { roleHomePath } from "@/utils/roleHomePath";



export default function RegisterWizard() {

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [bloodTypes, setBloodTypes] = useState<BloodType[]>([]);
  const [error, setError] = useState<String>();
  
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const allergyData = await getAllergies();
        const bloodData = await getBloodType();
        
        if (!cancelled) {
          setAllergies(allergyData);
          setBloodTypes(bloodData);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load allergies or bloodTypes")
      }
    })();
    return () => {
      cancelled = true;
    }
  }, []);

  const [userForm, setUserForm] = useState<RegisterUserForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [patientForm, setPatientForm] = useState<PatientDetailsForm>({
    gender: "other",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    bloodType: "",
    allergyIds: [],
  });

  const handleRegistrationStep1 = async () => {  
    const res = await register(userForm.firstName, userForm.lastName, userForm.email, userForm.password);
    
    setUserId(res.userId);
    setStep(2);
  };

  const handleRegistrationStep2 = async () => {
    if (userId == null){
      setStep(1);
      throw new Error("Missing user ID");
    }

    //login and get token
    const authRes = await loginAPI(userForm.email, userForm.password);
    tokenRef.current = authRes.token;
    setTokenGetter(() => tokenRef.current);

    //get the patients age from DOB
    const patientAge = getAgeFromDOB(patientForm.dateOfBirth);
    if (patientAge === null){
      throw new Error ("Invalid date of birth")
    }

    //make request payload
    const allergyPayload: string[] = allergies.filter((a) => patientForm.allergyIds.includes(a.allergyId)).map((a) => a.name);
    const payload: PatchPatientRequest = {
      address: patientForm.address,
      age: patientAge,
      allergies: allergyPayload,
      bloodType: patientForm.bloodType,
      dateOfBirth: patientForm.dateOfBirth,
      gender: patientForm.gender,
      phoneNumber: patientForm.phoneNumber,
    };
    console.log("PATCH payload", payload);

    //patch
    await patchPatient(userId, payload);
    
    //log in
    login({ user: authRes.user, token: authRes.token });

    // If redirected here from ProtectedRoute, go back after login
    const state = location.state as { from?: string } | null;
    const from = state?.from;
    
    const roleHome = roleHomePath(authRes.user.role);
    const destination = from && from !== "/" && from !== "/login" ? from : roleHome;

    navigate(destination, { replace: true });
  };

  return (
    <>
      {error && (
        <div className="rounded-xl border border-red-200 font-medium bg-red-50 p-3 text-sm text-red-700 text-center">
          {error}
        </div>
      )}
      {step === 1 ? (
        <RegisterForm1
          value={userForm}
          onChange={setUserForm}
          onNext={handleRegistrationStep1}
        />
      ) : (
        <RegisterForm2
          value={patientForm}
          onChange={setPatientForm} 
          onSubmit={handleRegistrationStep2}
          allergies={allergies}
          bloodTypes={bloodTypes}
        />          
      )}
    </>
  );
}