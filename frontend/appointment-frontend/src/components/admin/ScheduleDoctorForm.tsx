import { useState } from "react";

interface Doctor {
  id: number;
  name: string;
}

interface ScheduleDoctorFormProps {
  doctors: Doctor[];
  onSubmit: (doctorId: number, date: string, startTime: string, endTime: string) => void;
  onDoctorChange?: (doctorId: number) => void;
}

export default function ScheduleDoctorForm({
  doctors,
  onSubmit,
  onDoctorChange,
}: ScheduleDoctorFormProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDoctor && date && startTime && endTime) {
      onSubmit(Number(selectedDoctor), date, startTime, endTime);
      // Reset form
      setDate("");
      setStartTime("");
      setEndTime("");
    }
  };

  return (
    <div className="rounded-2xl p-8 mb-8 shadow-sm bg-white">
      <h2 className="m-0 mb-6 font-bold text-slate-800 text-2xl">
        Schedule Doctor
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="doctor-select"
            className="block mb-2 font-semibold text-slate-700 text-sm"
          >
            Select Doctor
          </label>
          <select
            id="doctor-select"
            value={selectedDoctor}
            //onChange={(e) => setSelectedDoctor(e.target.value)}
            onChange={(e) => {
              const value = e.target.value === "" ? "" : Number(e.target.value);
              setSelectedDoctor(value);
              if (value !== "" && onDoctorChange) {
                onDoctorChange(Number(value));
              }
            }}
            //^ new Line of code
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
            required
          >
            <option value="">Choose a doctor...</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="date"
              className="block mb-2 font-semibold text-slate-700 text-sm"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
              required
            />
          </div>

          <div>
            <label
              htmlFor="start-time"
              className="block mb-2 font-semibold text-slate-700 text-sm"
            >
              Start
            </label>
            <input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
              required
            />
          </div>

          <div>
            <label
              htmlFor="end-time"
              className="block mb-2 font-semibold text-slate-700 text-sm"
            >
              End
            </label>
            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
