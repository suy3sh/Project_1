type Props = {
    query: string;
    onQueryChange: (newQuery: string) => void;

    speciality: string;
    onSpecialityChange: (newSpeciality: string) => void;

    gender: string;
    onGenderChange: (newGender: string) => void;

    specialityOptions: string[];
    genderOptions: readonly string[];
    disabled?: boolean;
}

export default function DoctorBrowseFilters({ query, onQueryChange, speciality, onSpecialityChange, gender, onGenderChange, specialityOptions, genderOptions, disabled }: Props) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Search</label>
                    <input
                        disabled={disabled}
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Search by name or bio…"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Speciality</label>
                    <select
                        disabled={disabled}
                        value={speciality}
                        onChange={(e) => onSpecialityChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="">All</option>
                        {specialityOptions.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-600 mb-1">Gender</label>
                    <select
                        disabled={disabled}
                        value={gender}
                        onChange={(e) => onGenderChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        <option value="">All</option>
                        {genderOptions.map((g) => (
                            <option key={g} value={g}>
                                {g}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}