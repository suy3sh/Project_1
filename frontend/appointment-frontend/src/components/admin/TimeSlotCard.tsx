interface TimeSlotCardProps {
  id: number;
  doctorName: string;
  date: string;
  timeslot: string;
  onDelete?: (id: number) => void;
}

export default function TimeSlotCard({
  id,
  doctorName,
  date,
  timeslot,
  onDelete,
}: TimeSlotCardProps) {
  return (
    <div className="relative rounded-xl p-5 shadow-sm bg-white transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md">
      {onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors"
          aria-label="Delete time slot"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
      <div className="pr-8">
        <p className="m-0 mb-2 text-slate-800">
          <span className="font-semibold">Name:</span> {doctorName}
        </p>
        <p className="m-0 mb-2 text-slate-800">
          <span className="font-semibold">Date:</span> {date}
        </p>
        <p className="m-0 text-slate-800">
          <span className="font-semibold">Timeslot:</span> {timeslot}
        </p>
      </div>
    </div>
  );
}
