import { fetchAppointmentsForPatient, fetchAllDoctorAppointments, updateAppointmentStatus, getMyAppointments, } from "@/services/appointmentService";

import { http } from "@/services/http";

jest.mock("@/services/http", () => ({
  http: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

const mockedGet = http.get as jest.MockedFunction<typeof http.get>;
const mockedPatch = http.patch as jest.MockedFunction<typeof http.patch>;

describe("appointmentService (UNIT)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchAppointmentsForPatient", () => {
    test("calls GET /appointments/patient/:id and returns data", async () => {
      mockedGet.mockResolvedValueOnce({
        data: [
          {
            appointmentId: 1,
            doctorName: "Dr. Who",
            appointmentType: "Checkup",
            startTime: "2026-01-27T09:00:00",
            endTime: "2026-01-27T09:30:00",
            status: "CONFIRMED",
          },
        ],
      } as any);

      const res = await fetchAppointmentsForPatient(99);

      expect(mockedGet).toHaveBeenCalledWith("/appointments/patient/99");
      expect(res).toHaveLength(1);
      expect(res[0].appointmentId).toBe(1);
      expect(res[0].doctorName).toBe("Dr. Who");
    });
  });

  describe("fetchAllDoctorAppointments", () => {
    test("calls GET /doctors/:id/appointments/all and maps ISO datetime to date + HH:MM time", async () => {
      mockedGet.mockResolvedValueOnce({
        data: [
          {
            appointmentId: 10,
            patientFirstName: "Sam",
            patientLastName: "Chen",
            appointmentType: "Cardiology",
            scheduledDateTime: "2026-01-24T09:05:00",
            status: "CONFIRMED",
          },
          {
            appointmentId: 11,
            patientFirstName: "Jane",
            patientLastName: "Doe",
            appointmentType: "Checkup",
            scheduledDateTime: "2026-01-24T16:30",
            status: "COMPLETED",
          },
        ],
      } as any);

      const res = await fetchAllDoctorAppointments(7);

      expect(mockedGet).toHaveBeenCalledWith("/doctors/7/appointments/all");

      expect(res).toEqual([
        {
          appointmentId: 10,
          patientFirstName: "Sam",
          patientLastName: "Chen",
          appointmentType: "Cardiology",
          date: "2026-01-24",
          time: "09:05",
          status: "CONFIRMED",
        },
        {
          appointmentId: 11,
          patientFirstName: "Jane",
          patientLastName: "Doe",
          appointmentType: "Checkup",
          date: "2026-01-24",
          time: "16:30",
          status: "COMPLETED",
        },
      ]);
    });

    test("pads single-digit hours/minutes (defensive)", async () => {
      // even if backend ever sent weird non-padded times, our helper pads
      mockedGet.mockResolvedValueOnce({
        data: [
          {
            appointmentId: 12,
            patientFirstName: "A",
            patientLastName: "B",
            appointmentType: "X",
            scheduledDateTime: "2026-01-24T7:3:00",
            status: "CONFIRMED",
          },
        ],
      } as any);

      const res = await fetchAllDoctorAppointments(1);

      expect(res[0].date).toBe("2026-01-24");
      expect(res[0].time).toBe("07:03");
    });
  });

  describe("updateAppointmentStatus", () => {
    test("calls PATCH /doctors/:doctorId/appointments/:appointmentId/status with {status} and returns data", async () => {
      mockedPatch.mockResolvedValueOnce({
        data: { appointmentId: 123, status: "CANCELLED" },
      } as any);

      const res = await updateAppointmentStatus(7, 123, "CANCELLED");
      expect(mockedPatch).toHaveBeenCalledWith(
        "/doctors/7/appointments/123/status",
        { status: "CANCELLED" }
      );

      expect(res).toEqual({ appointmentId: 123, status: "CANCELLED" });
    });
  });

  describe("getMyAppointments", () => {
    test("calls GET /doctors/me/appointments/today and returns data", async () => {
      mockedGet.mockResolvedValueOnce({
        data: [{ appointmentId: 1 }, { appointmentId: 2 }],
      } as any);

      const res = await getMyAppointments();

      expect(mockedGet).toHaveBeenCalledWith("/doctors/me/appointments/today");
      expect(res).toEqual([{ appointmentId: 1 }, { appointmentId: 2 }]);
    });
  });
});