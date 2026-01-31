import { renderHook, waitFor, act } from "@testing-library/react";
import type { Doctor } from "@/types/doctorTypes";
import { useDoctorsBrowse } from "@/services/useDoctorBrowse";
import { getAllDoctors } from "@/services/doctorServices";

jest.mock("@/services/doctorServices", () => ({
  getAllDoctors: jest.fn(),
}));

const mockedGetAllDoctors = getAllDoctors as jest.MockedFunction<
  typeof getAllDoctors
>;

function makeDoctor(overrides?: Partial<Doctor>): Doctor {
  return {
    doctorId: 1 as any,
    gender: "male" as any,
    bio: "Bio" as any,
    experienceYears: 5 as any,
    speciality: { specialityName: "Cardiology" } as any,
    user: { firstName: "Ben", lastName: "Martinez", email: "ben@test.com" } as any,
    ...overrides,
  } as Doctor;
}

describe("useDoctorsBrowse (UNIT)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("initial state: loading=true, error='', doctors empty; genderOptions constant", () => {
    mockedGetAllDoctors.mockReturnValue(new Promise(() => {}) as any);

    const { result } = renderHook(() => useDoctorsBrowse());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe("");
    expect(result.current.doctors).toEqual([]);
    expect(result.current.filteredDoctors).toEqual([]);
    expect(result.current.genderOptions).toEqual(["Male", "Female"]);
  });

  test("calls getAllDoctors with AbortController.signal and populates doctors on success", async () => {
    const docs: Doctor[] = [
      makeDoctor({ doctorId: 1 as any }),
      makeDoctor({
        doctorId: 2 as any,
        user: { firstName: "Samuel", lastName: "Chen", email: "sam@test.com" } as any,
        speciality: { specialityName: "Dermatology" } as any,
      }),
    ];

    mockedGetAllDoctors.mockResolvedValue(docs as any);

    const { result } = renderHook(() => useDoctorsBrowse());

    // verify getAllDoctors called with a signal
    expect(mockedGetAllDoctors).toHaveBeenCalledTimes(1);
    const passedSignal = mockedGetAllDoctors.mock.calls[0][0];
    expect(passedSignal).toBeDefined();
    expect(typeof passedSignal?.aborted).toBe("boolean");

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("");
    expect(result.current.doctors).toEqual(docs);
    expect(result.current.filteredDoctors).toEqual(docs);
  });

  test("sets error message when getAllDoctors fails with a non-cancel error", async () => {
    mockedGetAllDoctors.mockRejectedValue(new Error("Network down"));

    const { result } = renderHook(() => useDoctorsBrowse());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.doctors).toEqual([]);
    expect(result.current.filteredDoctors).toEqual([]);
    expect(result.current.error).toBe("Network down");
  });

  test("defaults error message when error has no message", async () => {
    mockedGetAllDoctors.mockRejectedValue({});

    const { result } = renderHook(() => useDoctorsBrowse());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to load doctors.");
  });

  test("ignores AbortError (no error set)", async () => {
    mockedGetAllDoctors.mockRejectedValue({ name: "AbortError" });

    const { result } = renderHook(() => useDoctorsBrowse());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("");
  });

  test("ignores Axios-style cancel errors (CanceledError / ERR_CANCELED)", async () => {
    mockedGetAllDoctors.mockRejectedValue({ name: "CanceledError" });

    const { result } = renderHook(() => useDoctorsBrowse());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("");

    jest.clearAllMocks();
    mockedGetAllDoctors.mockRejectedValue({ code: "ERR_CANCELED" });

    const { result: result2 } = renderHook(() => useDoctorsBrowse());

    await waitFor(() => {
      expect(result2.current.loading).toBe(false);
    });

    expect(result2.current.error).toBe("");
  });

  test("specialityOptions is unique, trimmed, and sorted A→Z", async () => {
    const docs: Doctor[] = [
      makeDoctor({ speciality: { specialityName: "Cardiology" } as any }),
      makeDoctor({ doctorId: 2 as any, speciality: { specialityName: "Dermatology" } as any }),
      makeDoctor({ doctorId: 3 as any, speciality: { specialityName: "Cardiology" } as any }), // duplicate
      makeDoctor({ doctorId: 4 as any, speciality: { specialityName: "  " } as any }), // ignored
      makeDoctor({ doctorId: 5 as any, speciality: undefined as any }), // ignored
      makeDoctor({ doctorId: 6 as any, speciality: { specialityName: "Allergy" } as any }),
    ];

    mockedGetAllDoctors.mockResolvedValue(docs as any);

    const { result } = renderHook(() => useDoctorsBrowse());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.specialityOptions).toEqual([
      "Allergy",
      "Cardiology",
      "Dermatology",
    ]);
  });

  test("filters by query: matches doctor name OR speciality (case-insensitive)", async () => {
    const docs: Doctor[] = [
      makeDoctor({
        doctorId: 1 as any,
        user: { firstName: "Samuel", lastName: "Chen", email: "sam@test.com" } as any,
        speciality: { specialityName: "Dermatology" } as any,
      }),
      makeDoctor({
        doctorId: 2 as any,
        user: { firstName: "Ben", lastName: "Martinez", email: "ben@test.com" } as any,
        speciality: { specialityName: "Cardiology" } as any,
      }),
    ];

    mockedGetAllDoctors.mockResolvedValue(docs as any);

    const { result } = renderHook(() => useDoctorsBrowse());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // query by name
    act(() => {
      result.current.setQuery("samuel");
    });
    expect(result.current.filteredDoctors.map((d) => (d as any).doctorId)).toEqual([1]);

    // query by speciality
    act(() => {
      result.current.setQuery("cardio");
    });
    expect(result.current.filteredDoctors.map((d) => (d as any).doctorId)).toEqual([2]);

    // query with whitespace/case
    act(() => {
      result.current.setQuery("  DERM  ");
    });
    expect(result.current.filteredDoctors.map((d) => (d as any).doctorId)).toEqual([1]);
  });

  test("filters by speciality dropdown: compares label-to-label (case-insensitive)", async () => {
    const docs: Doctor[] = [
      makeDoctor({ doctorId: 1 as any, speciality: { specialityName: "Cardiology" } as any }),
      makeDoctor({ doctorId: 2 as any, speciality: { specialityName: "Dermatology" } as any }),
    ];

    mockedGetAllDoctors.mockResolvedValue(docs as any);

    const { result } = renderHook(() => useDoctorsBrowse());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSpeciality("Dermatology"); // dropdown label
    });

    expect(result.current.filteredDoctors.map((d) => (d as any).doctorId)).toEqual([2]);
  });

  test("filters by gender dropdown: compares to doc.gender lowercased", async () => {
    const docs: Doctor[] = [
      makeDoctor({ doctorId: 1 as any, gender: "male" as any }),
      makeDoctor({ doctorId: 2 as any, gender: "female" as any }),
    ];

    mockedGetAllDoctors.mockResolvedValue(docs as any);

    const { result } = renderHook(() => useDoctorsBrowse());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setGender("Female"); // dropdown label
    });

    expect(result.current.filteredDoctors.map((d) => (d as any).doctorId)).toEqual([2]);
  });

  test("filters combine: query + speciality + gender all must match", async () => {
    const docs: Doctor[] = [
      makeDoctor({
        doctorId: 1 as any,
        gender: "male" as any,
        user: { firstName: "Sam", lastName: "Alpha", email: "a@test.com" } as any,
        speciality: { specialityName: "Cardiology" } as any,
      }),
      makeDoctor({
        doctorId: 2 as any,
        gender: "female" as any,
        user: { firstName: "Sam", lastName: "Beta", email: "b@test.com" } as any,
        speciality: { specialityName: "Cardiology" } as any,
      }),
    ];

    mockedGetAllDoctors.mockResolvedValue(docs as any);

    const { result } = renderHook(() => useDoctorsBrowse());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setQuery("sam");
      result.current.setSpeciality("Cardiology");
      result.current.setGender("Female");
    });

    expect(result.current.filteredDoctors.map((d) => (d as any).doctorId)).toEqual([2]);
  });
});
