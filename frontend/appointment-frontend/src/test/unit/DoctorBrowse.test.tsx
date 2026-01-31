import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DoctorsBrowse from "@/pages/public/DoctorsBrowse";

// --------------------
// Mocks
// --------------------

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  __esModule: true,
  useNavigate: () => mockNavigate,
}));

jest.mock("react-calendar", () => ({
  __esModule: true,
  default: () => <div data-testid="react-calendar-mock" />,
}));

// Mock the data hook
const mockUseDoctorsBrowse = jest.fn();

jest.mock("@/services/useDoctorBrowse", () => ({
  useDoctorsBrowse: () => mockUseDoctorsBrowse(),
}));

// Mock DoctorBrowseFilters (pure presentational in this test)
jest.mock("@/components/doctor/DoctorBrowseFilters", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="filters">
      <div>Filters mounted</div>
      <div data-testid="filters-query">{props.query}</div>
      <div data-testid="filters-speciality">{props.speciality}</div>
      <div data-testid="filters-gender">{props.gender}</div>
      <div data-testid="filters-disabled">{String(props.disabled)}</div>
    </div>
  ),
}));

// Mock DoctorList to expose onToggle/onBook and expandedDoctorId
jest.mock("@/components/doctor/DoctorList", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="doctor-list">
      <div data-testid="doctor-count">{props.doctors.length}</div>

      <button
        type="button"
        onClick={() => props.onToggle(props.doctors[0]?.doctorId)}
      >
        Toggle first doctor
      </button>

      <button
        type="button"
        onClick={() => props.onBook(props.doctors[0]?.doctorId)}
      >
        Book first doctor
      </button>

      <div data-testid="expanded-id">{props.expandedDoctorId ?? "null"}</div>
    </div>
  ),
}));

// --------------------
// Test helpers
// --------------------

function makeDoctor(overrides?: Partial<any>) {
  return {
    doctorId: 1,
    gender: "male",
    bio: "Bio",
    experienceYears: 5,
    speciality: { specialityName: "Cardiology" },
    user: { firstName: "Ben", lastName: "Martinez", email: "ben@test.com" },
    ...overrides,
  };
}

function mockHookReturn(overrides?: Partial<any>) {
  mockUseDoctorsBrowse.mockReturnValue({
    filteredDoctors: [],
    loading: false,
    error: "",
    query: "",
    setQuery: jest.fn(),
    speciality: "",
    setSpeciality: jest.fn(),
    gender: "",
    setGender: jest.fn(),
    specialityOptions: [],
    genderOptions: ["Male", "Female"],
    ...overrides,
  });
}

// --------------------
// Tests
// --------------------

describe("DoctorsBrowse", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders header and loading text when loading=true", () => {
    mockHookReturn({
      loading: true,
      filteredDoctors: [],
    });

    render(<DoctorsBrowse />);

    expect(screen.getByText("Browse Doctors")).toBeInTheDocument();
    expect(screen.getByText("Loading…")).toBeInTheDocument();

    // Filters should still mount
    expect(screen.getByTestId("filters")).toBeInTheDocument();
    expect(screen.getByTestId("filters-disabled")).toHaveTextContent("true");
  });

  test("renders result count when not loading", () => {
    mockHookReturn({
      loading: false,
      filteredDoctors: [makeDoctor(), makeDoctor({ doctorId: 2 })],
    });

    render(<DoctorsBrowse />);

    expect(screen.getByText("2 result(s)")).toBeInTheDocument();
    expect(screen.getByTestId("doctor-count")).toHaveTextContent("2");
  });

  test("shows error banner when error exists", () => {
    mockHookReturn({
      loading: false,
      error: "Failed to load doctors.",
      filteredDoctors: [],
    });

    render(<DoctorsBrowse />);

    expect(screen.getByText("Could not load doctors")).toBeInTheDocument();
    expect(screen.getByText("Failed to load doctors.")).toBeInTheDocument();
  });

  test("shows empty state when no results and no error", () => {
    mockHookReturn({
      loading: false,
      error: "",
      filteredDoctors: [],
    });

    render(<DoctorsBrowse />);

    expect(screen.getByText("No doctors match your filters.")).toBeInTheDocument();
  });

  test("clicking Back calls navigate(-1)", async () => {
    const user = userEvent.setup();

    mockHookReturn({
      loading: false,
      filteredDoctors: [],
    });

    render(<DoctorsBrowse />);

    await user.click(screen.getByRole("button", { name: "← Back" }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test("booking a doctor navigates with doctorId + prefillQuery", async () => {
    const user = userEvent.setup();

    mockHookReturn({
      loading: false,
      filteredDoctors: [
        makeDoctor({
          doctorId: 10,
          user: { firstName: "Samuel", lastName: "Chen", email: "sam@test.com" },
        }),
      ],
    });

    render(<DoctorsBrowse />);

    await user.click(screen.getByRole("button", { name: "Book first doctor" }));

    expect(mockNavigate).toHaveBeenCalledWith("/patient/book", {
      state: {
        doctorId: 10,
        prefillQuery: "Samuel Chen",
      },
    });
  });

  test("toggling a doctor updates expandedDoctorId passed to DoctorList", async () => {
    const user = userEvent.setup();

    mockHookReturn({
      loading: false,
      filteredDoctors: [makeDoctor({ doctorId: 7 })],
    });

    render(<DoctorsBrowse />);

    // Initially null
    expect(screen.getByTestId("expanded-id")).toHaveTextContent("null");

    // Toggle
    await user.click(screen.getByRole("button", { name: "Toggle first doctor" }));

    // expandedDoctorId becomes 7
    expect(screen.getByTestId("expanded-id")).toHaveTextContent("7");
  });
});