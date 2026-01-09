import { useNavigate } from "react-router-dom";
import { useState } from "react";

function DoctorsBrowse() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);

  //TEMPORARY
  const doctors = [
    {
      id: 1,
      name: "Dr. Ben Martinez, MD",
      image: "https://www.shutterstock.com/image-photo/portrait-handsome-male-doctor-stethoscope-600nw-2480850611.jpg",
      qualification: "MD – Internal Medicine",
      experience: "12 years",
      specialization: "Cardiology",
    },
    {
      id: 2,
      name: "Dr. Samuel Chen, DO",
      image: "https://cdn.pixabay.com/photo/2023/12/21/06/23/doctor-8461303_1280.jpg",
      qualification: "DO – Family Medicine",
      experience: "8 years",
      specialization: "General Physician",
    },
    {
      id: 3,
      name: "Dr. Leya Al-Sayed, MBBS",
      image: "https://thumbs.dreamstime.com/b/happy-young-indian-doctor-holding-hand-female-patient-giving-support-motivating-recovery-rehabilitation-telling-good-399999435.jpg",
      qualification: "MBBS – Pediatrics",
      experience: "10 years",
      specialization: "Child Health",
    },
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-indigo-600 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-10">
        Our Doctors
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            onClick={() => toggleExpand(doctor.id)}
            className="relative bg-white rounded-2xl shadow-md hover:shadow-xl cursor-pointer h-[425px]"
          >
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-64 object-cover rounded-t-2xl"
            />

            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800">
                {doctor.name}
              </h3>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  expandedId === doctor.id
                    ? "max-h-96 opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="text-gray-600 space-y-2">
                  <p><strong>Qualification:</strong> {doctor.qualification}</p>
                  <p><strong>Experience:</strong> {doctor.experience}</p>
                  <p><strong>Specialization:</strong> {doctor.specialization}</p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/patient/book", { state: { doctorId: doctor.id } });
                    }}
                    className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorsBrowse;
