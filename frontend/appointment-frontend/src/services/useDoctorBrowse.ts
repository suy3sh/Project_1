import { useEffect, useMemo, useState } from "react";
import type { Doctor } from "@/types/doctorTypes";
import { getAllDoctors } from "@/services/doctorServices";

export function useDoctorsBrowse() {
    // Data
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // Filters
    const [query, setQuery] = useState<string>("");
    const [speciality, setSpeciality] = useState<string>("");
    const [gender, setGender] = useState<string>("");

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError("");

        getAllDoctors(controller.signal)
        .then((data: Doctor[]) => setDoctors(data))
        .catch((err: any) => {
            // ignore cancellations
            if (err?.name === "AbortError") return;
            if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;

            setError(err?.message ?? "Failed to load doctors.");
        })
        .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    const specialityOptions = useMemo(() => {
        const names = doctors
        .map((doc) => doc.speciality?.specialityName)
        .filter((name): name is string => Boolean(name && name.trim()));

        return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
    }, [doctors]);

    const genderOptions = ["Male", "Female"] as const;

    const filteredDoctors = useMemo(() => {
        const q = query.toLowerCase().trim();

        return doctors.filter((doc) => {
        const name = `${doc.user.firstName} ${doc.user.lastName}`.toLowerCase();
        const spec = (doc.speciality?.specialityName ?? "").toLowerCase();

        const matchesQuery = q === "" || name.includes(q) || spec.includes(q);

        // speciality is selected from dropdown as display label, so compare label-to-label
        const matchesSpeciality =
            speciality === "" || spec === speciality.toLowerCase();

        const matchesGender =
            gender === "" || doc.gender === gender.toLowerCase();

        return matchesQuery && matchesSpeciality && matchesGender;
        });
    }, [doctors, query, speciality, gender]);

    return {
        // data
        doctors,
        filteredDoctors,
        loading,
        error,

        // filters
        query,
        setQuery,
        speciality,
        setSpeciality,
        gender,
        setGender,

        // options
        specialityOptions,
        genderOptions,
    };
}