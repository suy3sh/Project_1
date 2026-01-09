export default function DoctorHome({

    // Sample data for demonstration purposes. Will connect to backend later.
  doctor = {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    experience: "15 years",
    education: "MD, Harvard Medical School",
    contact: "sarah.johnson@hospital.com",
  },
  sectionTitle = "Today's Appointments",
  appointments = [
    { id: 1, patientName: "Michael Chen", age: 54, date: "Dec 18, 2024", time: "9:00 AM", type: "Follow-up" },
    { id: 2, patientName: "Emily Rodriguez", age: 42, date: "Dec 18, 2024", time: "10:30 AM", type: "Consultation" },
    { id: 3, patientName: "James Thompson", age: 67, date: "Dec 18, 2024", time: "1:00 PM", type: "Annual Checkup" },
    { id: 4, patientName: "Sophia Patel", age: 39, date: "Dec 18, 2024", time: "2:30 PM", type: "New Patient" },
    { id: 5, patientName: "David Kim", age: 58, date: "Dec 18, 2024", time: "4:00 PM", type: "Follow-up" },
  ],
}) {
  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Doctor Profile Section */}
        <div className="rounded-2xl p-8 mb-8 shadow-sm bg-white">
          <div className="flex gap-8 items-start flex-wrap">
            {/* Doctor Image */}
            <div className="flex-shrink-0">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                className="rounded-full"
                style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                aria-hidden="true"
              >
                <circle cx="60" cy="45" r="20" fill="white" opacity="0.9" />
                <ellipse cx="60" cy="85" rx="30" ry="20" fill="white" opacity="0.9" />
              </svg>
            </div>

            {/* Doctor Info */}
            <div className="flex-1 min-w-[300px]">
              <h1 className="m-0 mb-2 font-bold leading-tight text-slate-800 text-3xl">
                {doctor.name}
              </h1>
              <p className="m-0 mb-6 font-medium text-slate-500 text-lg">
                {doctor.specialty}
              </p>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                <div>
                  <p className="m-0 mb-1 font-semibold uppercase tracking-wide text-slate-500 text-sm">
                    Experience
                  </p>
                  <p className="m-0 text-slate-800">{doctor.experience}</p>
                </div>

                <div>
                  <p className="m-0 mb-1 font-semibold uppercase tracking-wide text-slate-500 text-sm">
                    Education
                  </p>
                  <p className="m-0 text-slate-800">{doctor.education}</p>
                </div>

                <div>
                  <p className="m-0 mb-1 font-semibold uppercase tracking-wide text-slate-500 text-sm">
                    Contact
                  </p>
                  <p className="m-0 text-slate-800">{doctor.contact}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div>
          <h2 className="m-0 mb-6 font-bold text-slate-800 text-2xl">{sectionTitle}</h2>

          <div className="grid gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="rounded-xl p-5 shadow-sm bg-white transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="m-0 mb-3 font-semibold text-slate-800 text-lg">
                      {apt.patientName}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-slate-500 text-sm">
                      <span>Age: {apt.age}</span>
                      <span aria-label="Date">📅 {apt.date}</span>
                      <span aria-label="Time">🕐 {apt.time}</span>
                    </div>
                  </div>

                  <div>
                    <span className="inline-block px-4 py-1.5 rounded-full font-medium text-white bg-blue-500 text-xs">
                      {apt.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}