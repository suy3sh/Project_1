function DoctorsBrowse() {
  const doctors = [
    {
      name: "Dr. Ben Martinez, MD",
      image: "https://www.shutterstock.com/image-photo/portrait-handsome-male-doctor-stethoscope-600nw-2480850611.jpg",
    },
    {
      name: "Dr. Samuel Chen, DO",
      image: "https://media.istockphoto.com/id/1468678624/photo/nurse-hospital-employee-and-portrait-of-black-man-in-a-healthcare-wellness-and-clinic-feeling.jpg?s=612x612&w=0&k=20&c=AGQPyeEitUPVm3ud_h5_yVX4NKY9mVyXbFf50ZIEtQI=",
    },
    {
      name: "Dr. Leya Al-Sayed, MBBS",
      image: "https://thumbs.dreamstime.com/b/happy-young-indian-doctor-holding-hand-female-patient-giving-support-motivating-recovery-rehabilitation-telling-good-399999435.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Our Doctors</h1>
        <p className="text-gray-500 mt-2">
          Meet expert medical professionals.
        </p>
      </div>

      {/* DOCTORS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doctor, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-transparent hover:border-indigo-500 cursor-pointer"
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorsBrowse;
