export const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isStrongPassword = (password: string): boolean =>
    password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password);

export function formatPhoneNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    const length = digits.length;

    if (length < 4) return digits;
    if (length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function formatTime(t: string): string{
	if (!t) return "—";
    const hhmm = t.length >= 5 ? t.slice(0, 5) : t; // handles "HH:mm:ss" or "HH:mm"
    const [hStr, mStr] = hhmm.split(":");
    const h = Number(hStr);
    const m = Number(mStr);

    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    const minutes = m < 10 ? `0${m}` : `${m}`;

    return `${hour12}:${minutes} ${period}`;
}

export function getAgeFromDOB(dob: string): number | null {
    if (!dob) return null;

    const birthday = new Date(dob + "T00:00:00");
    if (Number.isNaN(birthday.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();

    const month = today.getMonth() - birthday.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthday.getDate())) {
        age -= 1;
    }

    return age;
}