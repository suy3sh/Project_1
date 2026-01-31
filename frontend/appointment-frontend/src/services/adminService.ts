import { http } from "./http";

export type AvailabilityWindow = {
  windowId: number;
  date: string;
  startTime: string;
  endTime: string;
  active: boolean;
  doctorId: number;
  doctorName: string | null;
};

export type AdminTimeSlot = {
  slotId: number;
  doctorId: number | null;
  doctorName: string | null;
  dateAvailable: string;
  startTime: string;
  endTime: string;
  status: string;
};

export type AdminAppointment = {
  appointmentId: number;
  status: string;
  scheduledDateTime: string;
  createdAt: string;
  patientId?: number;
  patientName?: string;
  doctorId?: number;
  doctorName?: string;
  slotId?: number;
  dateAvailable?: string;
  startTime?: string;
  endTime?: string;
  appointmentTypeId?: number;
  appointmentType?: string;
};

const logRequest = (method: string, url: string, params?: unknown, payload?: unknown) => {
  console.info("[adminService]", { method, url, params, payload });
};

const logError = (method: string, url: string, error: unknown) => {
  const err = error as {
    message?: string;
    response?: { status?: number; data?: unknown };
  };
  console.error("[adminService]", {
    method,
    url,
    message: err?.message,
    status: err?.response?.status,
    data: err?.response?.data,
  });
};

export async function createAvailabilityWindow(
  doctorId: number,
  payload: { date: string; startTime: string; endTime: string }
) {
  const url = `/admin/doctors/${doctorId}/availability-windows`;
  logRequest("POST", url, undefined, payload);
  try {
    const { data } = await http.post<AvailabilityWindow>(url, payload);
    return data;
  } catch (error) {
    logError("POST", url, error);
    throw error;
  }
}

export async function deleteAvailabilityWindow(windowId: number) {
  const url = `/admin/availability-windows/${windowId}`;
  logRequest("DELETE", url);
  try {
    const { data } = await http.delete<{ blockedCount: number; skippedSlotIds: number[] }>(url);
    return data;
  } catch (error) {
    logError("DELETE", url, error);
    throw error;
  }
}

export async function fetchAvailabilityWindows(doctorId: number) {
  const url = `/admin/doctors/${doctorId}/availability-windows`;
  logRequest("GET", url);
  try {
    const { data } = await http.get<AvailabilityWindow[]>(url);
    return data;
  } catch (error) {
    logError("GET", url, error);
    throw error;
  }
}

export async function fetchAdminTimeSlots(params?: {
  doctorId?: number;
  from?: string;
  to?: string;
  status?: string;
}) {
  const url = `/admin/time-slots`;
  logRequest("GET", url, params);
  try {
    const { data } = await http.get<AdminTimeSlot[]>(url, { params });
    return data;
  } catch (error) {
    logError("GET", url, error);
    throw error;
  }
}

export async function fetchAdminAppointments(status?: string) {
  const url = `/admin/appointments`;
  logRequest("GET", url, { status });
  try {
    const { data } = await http.get<AdminAppointment[]>(url, { params: { status } });
    return data;
  } catch (error) {
    logError("GET", url, error);
    throw error;
  }
}

export async function denyAppointment(appointmentId: number) {
  const url = `/admin/appointments/${appointmentId}/deny`;
  logRequest("PATCH", url);
  try {
    const { data } = await http.patch<AdminAppointment>(url);
    return data;
  } catch (error) {
    logError("PATCH", url, error);
    throw error;
  }
}

export async function cancelAppointment(appointmentId: number) {
  const url = `/admin/appointments/${appointmentId}/cancel`;
  logRequest("PUT", url);
  try {
    const { data } = await http.put<AdminAppointment>(url);
    return data;
  } catch (error) {
    logError("PUT", url, error);
    throw error;
  }
}






export type StaffMember = {
  id: number;
  name: string;
  role: "DOCTOR" | "ADMIN";
  email?: string;
};

export async function fetchAdminStaff() {
  const url = `/admin/staff`;
  logRequest("GET", url);
  try {
    const { data } = await http.get<Array<{
      userId: number;
      firstName: string;
      lastName: string;
      email: string;
      roleName: string;
    }>>(url);
    return data;
  } catch (error) {
    logError("GET", url, error);
    throw error;
  }
}
