import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";



import { getMyDoctor } from "@/services/doctorServices";
import {
  fetchAllDoctorAppointments,
  updateAppointmentStatus,
} from "@/services/appointmentService";
import DoctorAppointmentsPage from "@/pages/doctor/DoctorCalendarPage";

jest.mock("@/services/doctorServices", () => ({
  getMyDoctor: jest.fn(),
}));

jest.mock("@/services/appointmentService", () => ({
  fetchAllDoctorAppointments: jest.fn(),
  updateAppointmentStatus: jest.fn(),
}));

const mockedGetMyDoctor = getMyDoctor as jest.MockedFunction<typeof getMyDoctor>;
const mockedFetchAllDoctorAppointments =
  fetchAllDoctorAppointments as jest.MockedFunction<typeof fetchAllDoctorAppointments>;
const mockedUpdateAppointmentStatus =
  updateAppointmentStatus as jest.MockedFunction<typeof updateAppointmentStatus>;

/**
 * Mock DoctorCalendar so we can:
 * - verify props (title, appointments count, etc.)
 * - trigger onUpdate deterministically without relying on Calendar UI internals
 */
jest.mock("@/components/doctor/DoctorCalendar", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="doctor-calendar">
      <h1 data-testid="calendar-title">{props.title}</h1>
      <div data-testid="appointments-count">{props.appointments?.length ?? 0}</div>

      <button
        type="button"
        onClick={async () => {
          const first = props.appointments?.[0];
          if (!first) return;

          // Simulate user toggling status to "CANCELLED"
          const next = { ...first, status: "CANCELLED" };

          const res = await props.onUpdate?.(next);
          // Expose result to assertions
          (window as any).__lastUpdateResult = res;
        }}
      >
        Update First Appointment
      </button>

      <div data-testid="no-appointments-message">
        {props.appointments?.length ? "" : props.noAppointmentsMessage}
      </div>
    </div>
  ),
}));

function makeDoctor(overrides: Partial<any> = {}) {
  return {
    doctorId: 42,
    ...overrides,
  };
}

function makeAppointment(overrides: Partial<any> = {}) {
  return {
    appointmentId: 100,
    status: "SCHEDULED",
    startTime: "2026-01-27T09:00:00",
    endTime: "2026-01-27T09:30:00",
    patientName: "Jane Doe",
    appointmentType: "Checkup",
    ...overrides,
  };
}

describe("DoctorAppointmentsPage (INTEGRATION)", () => {
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    (window as any).__lastUpdateResult = undefined;
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  test("shows loading initially then renders DoctorCalendar with fetched appointments", async () => {
    mockedGetMyDoctor.mockResolvedValue(makeDoctor({ doctorId: 7 }) as any);
    mockedFetchAllDoctorAppointments.mockResolvedValue([
      makeAppointment({ appointmentId: 1 }),
      makeAppointment({ appointmentId: 2 }),
    ] as any);

    render(<DoctorAppointmentsPage />);

    // loading view
    expect(screen.getByText("Loading appointments…")).toBeInTheDocument();

    // eventually calendar renders
    expect(await screen.findByTestId("doctor-calendar")).toBeInTheDocument();

    expect(screen.getByTestId("calendar-title")).toHaveTextContent("Your Appointments");
    expect(screen.getByTestId("appointments-count")).toHaveTextContent("2");

    // Service calls
    expect(mockedGetMyDoctor).toHaveBeenCalledTimes(1);
    expect(mockedFetchAllDoctorAppointments).toHaveBeenCalledWith(7);
  });

  test("renders empty state message when no appointments", async () => {
    mockedGetMyDoctor.mockResolvedValue(makeDoctor({ doctorId: 7 }) as any);
    mockedFetchAllDoctorAppointments.mockResolvedValue([] as any);

    render(<DoctorAppointmentsPage />);

    expect(await screen.findByTestId("doctor-calendar")).toBeInTheDocument();
    expect(screen.getByTestId("appointments-count")).toHaveTextContent("0");
    expect(screen.getByTestId("no-appointments-message")).toHaveTextContent(
      "No appointments scheduled"
    );
  });

  test("shows error UI when getMyDoctor fails", async () => {
    mockedGetMyDoctor.mockRejectedValue(new Error("no auth"));

    render(<DoctorAppointmentsPage />);

    expect(await screen.findByText("Failed to load appointments")).toBeInTheDocument();
    expect(mockedFetchAllDoctorAppointments).not.toHaveBeenCalled();
  });

  test("shows error UI when fetchAllDoctorAppointments fails", async () => {
    mockedGetMyDoctor.mockResolvedValue(makeDoctor({ doctorId: 7 }) as any);
    mockedFetchAllDoctorAppointments.mockRejectedValue(new Error("db down"));

    render(<DoctorAppointmentsPage />);

    expect(await screen.findByText("Failed to load appointments")).toBeInTheDocument();
  });

  test("onUpdate success: calls updateAppointmentStatus and updates appointments state with backend response", async () => {
    const user = userEvent.setup();

    mockedGetMyDoctor.mockResolvedValue(makeDoctor({ doctorId: 7 }) as any);

    mockedFetchAllDoctorAppointments.mockResolvedValue([
      makeAppointment({ appointmentId: 123, status: "SCHEDULED" }),
    ] as any);

    // backend returns updated appointment (source of truth)
    mockedUpdateAppointmentStatus.mockResolvedValue(
      makeAppointment({ appointmentId: 123, status: "CANCELLED" }) as any
    );

    render(<DoctorAppointmentsPage />);

    expect(await screen.findByTestId("doctor-calendar")).toBeInTheDocument();
    expect(screen.getByTestId("appointments-count")).toHaveTextContent("1");

    await user.click(screen.getByRole("button", { name: "Update First Appointment" }));

    await waitFor(() => {
      expect(mockedUpdateAppointmentStatus).toHaveBeenCalledWith(7, 123, "CANCELLED");
    });

    // Ensure handler returned ok
    expect((window as any).__lastUpdateResult).toEqual({ isOk: true });
  });

  test("onUpdate failure: returns error result and does not crash", async () => {
    const user = userEvent.setup();

    mockedGetMyDoctor.mockResolvedValue(makeDoctor({ doctorId: 7 }) as any);
    mockedFetchAllDoctorAppointments.mockResolvedValue([
      makeAppointment({ appointmentId: 123, status: "SCHEDULED" }),
    ] as any);

    mockedUpdateAppointmentStatus.mockRejectedValue(new Error("update failed"));

    render(<DoctorAppointmentsPage />);

    expect(await screen.findByTestId("doctor-calendar")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Update First Appointment" }));

    await waitFor(() => {
      expect(mockedUpdateAppointmentStatus).toHaveBeenCalled();
    });

    expect((window as any).__lastUpdateResult).toEqual({
      isOk: false,
      message: "Failed to update appointment status",
    });
  });
});