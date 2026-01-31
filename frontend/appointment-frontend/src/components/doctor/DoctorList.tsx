import { Doctor } from "@/types/doctorTypes";
import DoctorCard from "./DoctorCard";

type Props = {
    doctors: Doctor[];
    onToggle: (doctorId: number) => void;
    onBook: (doctorId: number) => void;
    expandedDoctorId: number | null;
}

export default function DoctorList({doctors, onToggle, onBook, expandedDoctorId}: Props) {
    return (
        <div className="grid grid cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> 
            {doctors.map((doctor) => (
                <DoctorCard
                    key={doctor.doctorId}
                    doctor={doctor}
                    expanded={expandedDoctorId === doctor.doctorId}
                    onToggle={() => onToggle(doctor.doctorId)}
                    onBook={onBook}
                />
            ))}
        </div>
    )
}