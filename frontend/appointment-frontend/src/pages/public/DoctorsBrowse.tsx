import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Doctor } from "@/types/doctorTypes";
import { getAllDoctors } from "@/services/doctorServices";
import DoctorList from "@/components/doctor/DoctorList";
import DoctorBrowseFilters from "@/components/doctor/DoctorBrowseFilters";
import { useDoctorsBrowse } from "@/services/useDoctorBrowse";

export default function DoctorsBrowse() {
    const navigate = useNavigate();

	// UI
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const {
		filteredDoctors, 
		loading, 
		error, 
		query, 
		setQuery, 
		speciality, 
		setSpeciality, 
		gender, 
		setGender, 
		specialityOptions, 
		genderOptions
	} = useDoctorsBrowse();

	const toggleExpand = (id: number) => {
		setExpandedId((prev) => (prev === id ? null : id));
	};

	const handleBook = (doctorId: number) => {
		const doc = filteredDoctors.find((d) => d.doctorId === doctorId);
		const doctorName = doc ? `${doc.user.firstName} ${doc.user.lastName}` : "";
		navigate("/patient/book", {
			state: {
			doctorId,
			prefillQuery: doctorName
			}
		});
	};

	return (
		<div className="min-h-screen bg-gray-50 px-6 md:px-10 py-10">
			<button
				onClick={() => navigate(-1)}
				className="mb-4 text-indigo-600 hover:underline"
			>
				← Back
			</button>

			<div className="flex items-start justify-between gap-4 mb-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Browse Doctors</h1>
						<p className="text-gray-600 mt-1">
							Search and filter by speciality, gender, and experience.
						</p>
				</div>

				<div className="text-sm text-gray-600">
					{loading ? "Loading…" : `${filteredDoctors.length} result(s)`}
				</div>
			</div>

			<DoctorBrowseFilters
				query={query}
				onQueryChange={setQuery}
				speciality={speciality}
				onSpecialityChange={setSpeciality}
				gender={gender}
				onGenderChange={setGender}
				specialityOptions={specialityOptions}
				genderOptions={genderOptions}
				disabled={loading}
			/>

			{error && (
				<div className="bg-white border border-red-200 text-red-700 rounded-xl p-4 mb-6">
					<div className="font-semibold">Could not load doctors</div>
					<div className="text-sm mt-1">{error}</div>
				</div>
			)}

			{!loading && !error && filteredDoctors.length === 0 && (
				<div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-700">
					No doctors match your filters.
				</div>
			)}

			<DoctorList
				doctors={filteredDoctors}
				expandedDoctorId={expandedId}
				onToggle={toggleExpand}
				onBook={handleBook}
			/>
		</div>
	);
}

