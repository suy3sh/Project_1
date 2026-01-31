import { Doctor } from "@/types/doctorTypes";

type Props = {
    doctor: Doctor;
    expanded: boolean;
    onToggle: () => void;
    onBook: (doctorId: number) => void
}

export default function DoctorCard({doctor, expanded, onToggle, onBook}: Props) {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onToggle}
            className="wtext-left bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-shadow"
        >
            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Dr. {doctor.user.firstName} {doctor.user.lastName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {doctor.speciality?.specialityName}
                        </p>
                    </div>

                    <span
                        className={`text-sm px-2 py-1 rounded-full border ${
                        expanded ? "border-indigo-300 text-indigo-700" : "border-gray-200 text-gray-600"
                        }`}
                    >
                        {expanded ? "Hide" : "View"}
                    </span>
                </div>

                <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        expanded ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="text-gray-700 space-y-2">
                        <p>
                            <span className="font-semibold">Gender:</span>{" "}
                            {doctor.gender && (doctor.gender.charAt(0).toUpperCase() + doctor.gender.slice(1).toLowerCase())}
                        </p>
                        <p>
                            <span className="font-semibold">Experience:</span>{" "}
                            {doctor.experienceYears} years
                        </p>
                        <p className="leading-relaxed">
                            <span className="font-semibold">Bio:</span>{" "}
                            {doctor.bio?.trim() ? doctor.bio : "—"}
                        </p>

                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onBook(doctor.doctorId);
                            }}
                            className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                        >
                            Book Appointment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}