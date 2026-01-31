// src/components/availability/AvailabilityPicker.tsx
import { useEffect, useState } from "react";
import type { TimeSlot } from "@/types/slotTypes";
import { fetchDoctorSlots } from "@/services/slotService";

type Props = {
  doctorId: number;
  date: string;
  selectedSlotId: number | null;
  onSelect: (slotId: number) => void;
};

export default function AvailabilityPicker({
  doctorId,
  date,
  selectedSlotId,
  onSelect,
}: Props) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctorId || !date) return;

    setLoading(true);
    fetchDoctorSlots(doctorId, date)
      .then(setSlots)
      .finally(() => setLoading(false));
  }, [doctorId, date]);

  if (loading) return <p>Loading slots...</p>;

  return (
    <div className="grid grid-cols-2 gap-3">
      {slots.map((slot) => (
        <button
          key={slot.slotId}
          disabled={!slot.available}
          onClick={() => onSelect(slot.slotId)}
          className={`border rounded-lg p-3 text-sm
            ${
              selectedSlotId === slot.slotId
                ? "bg-purple-600 text-white"
                : "bg-white"
            }
            ${!slot.available ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {slot.startTime} – {slot.endTime}
        </button>
      ))}
    </div>
  );
}
