import { useNavigate } from "react-router-dom";

function PatientProfile() {
  const navigate = useNavigate();

  const patient = {
    name: "Jane Smith",
    age: 23,
    gender: "Female",
    dob: "03/04/2003",
    bloodGroup: "O+",
    address: "123 Green Street, New York",
    allergies: "Peanuts",
    medicalHistory: "No chronic illness",
    lifestyle: "Vegetarian, exercises regularly"
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          style={styles.back}
          onClick={() => navigate("/patient/home")}
        >
          ← Back
        </button>

        <h2>Patient Profile</h2>

        <button
          style={styles.edit}
          onClick={() => navigate("/patient/profile/edit")}
        >
          Edit
        </button>
      </div>

      <div style={styles.card}>
        <ProfileRow label="Name" value={patient.name} />
        <ProfileRow label="Age" value={patient.age} />
        <ProfileRow label="Gender" value={patient.gender} />
        <ProfileRow label="Date of Birth" value={patient.dob} />
        <ProfileRow label="Blood Group" value={patient.bloodGroup} />
        <ProfileRow label="Address" value={patient.address} />
        <ProfileRow label="Allergies" value={patient.allergies} />
        <ProfileRow label="Medical History" value={patient.medicalHistory} />
        <ProfileRow label="Other Details" value={patient.lifestyle} />
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <span style={styles.value}>{value}</span>
    </div>
  );
}

export default PatientProfile;

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    padding: "20px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  back: {
    background: "#34495e",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  edit: {
    background: "#27ae60",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    maxWidth: "600px",
    margin: "auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee"
  },
  label: {
    fontWeight: "600"
  }
};
