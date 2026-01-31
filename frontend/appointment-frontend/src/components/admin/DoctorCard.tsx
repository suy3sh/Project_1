interface DoctorCardProps {
  id: number;
  name: string;
  email: string;
  speciality: string;
  yearsOfExperience: number;
  gender?: string;
  bio?: string;
}

export default function DoctorCard({
  name,
  email,
  speciality,
  yearsOfExperience,
  gender,
  bio,
}: DoctorCardProps) {
  return (
    <div className="rounded-xl p-5 shadow-sm bg-white transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md">
      <p className="m-0 mb-2 text-slate-800">
        <span className="font-semibold">Name:</span> {name}
      </p>
      <p className="m-0 mb-2 text-slate-800">
        <span className="font-semibold">Email:</span> {email}
      </p>
      <p className="m-0 mb-2 text-slate-800">
        <span className="font-semibold">Speciality:</span> {speciality}
      </p>
      <p className="m-0 mb-2 text-slate-800">
        <span className="font-semibold">Years of Experience:</span> {yearsOfExperience}
      </p>
      {gender && (
        <p className="m-0 mb-2 text-slate-800">
          <span className="font-semibold">Gender:</span> {gender}
        </p>
      )}
      {bio && (
        <p className="m-0 text-slate-800">
          <span className="font-semibold">Bio:</span> {bio}
        </p>
      )}
    </div>
  );
}
