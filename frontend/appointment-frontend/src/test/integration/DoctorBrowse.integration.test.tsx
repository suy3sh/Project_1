

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";

// IMPORTANT: import the page DIRECTLY, not from "@/pages" barrel
// Adjust this import to your actual DoctorsBrowse file path:
import DoctorsBrowse from "@/pages/public/DoctorsBrowse";

import { http } from "@/services/http";

jest.mock("@/services/http", () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
  // include these if your code imports them from http.ts
  setTokenGetter: jest.fn(),
}));

const mockedHttp = http as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
  delete: jest.Mock;
};

// Helper component to assert navigation + location.state
function LocationProbe() {
  const loc = useLocation();
  return (
    <pre data-testid="location-probe">{JSON.stringify({ pathname: loc.pathname, state: loc.state })}</pre>
  );
}

describe("DoctorsBrowse (INTEGRATION via http mock)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads doctors from API, renders results, and navigates to book with state", async () => {
    const user = userEvent.setup();

    // Make http.get return doctors for the doctors endpoint.
    // Adjust the URL match to your real endpoint used in doctorServices.
    mockedHttp.get.mockImplementation((url: string) => {
      if (url.includes("/doctors")) {
        return Promise.resolve({
          data: [
            {
              doctorId: 10,
              gender: "male",
              bio: "Bio",
              experienceYears: 5,
              speciality: { specialityName: "Cardiology" },
              user: { firstName: "Samuel", lastName: "Chen", email: "sam@test.com" },
            },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <MemoryRouter initialEntries={["/doctors/browse"]}>
        <Routes>
          <Route path="/doctors/browse" element={<DoctorsBrowse />} />
          <Route
            path="/patient/book"
            element={
              <>
                <div>Book Page</div>
                <LocationProbe />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // waits for loading to finish and results to appear
    await waitFor(() => {
      expect(screen.getByText(/result\(s\)/i)).toBeInTheDocument();
    });

    // Verify the underlying service called http.get (and roughly which endpoint)
    expect(mockedHttp.get).toHaveBeenCalled();
    const calledUrls = mockedHttp.get.mock.calls.map((c) => c[0]);
    expect(calledUrls.some((u) => String(u).includes("/doctors"))).toBe(true);

    // Click the real "BookAppointment" button (adjust selector to your actual UI)
    const bookButtons = screen.getAllByRole("button", { name: /book appointment/i });

    // The first match is the card div (role="button"), the second is the real <button>
    await user.click(bookButtons[1]);

    // Assert navigation target + state
    expect(screen.getByText("Book Page")).toBeInTheDocument();
    const probe = screen.getByTestId("location-probe").textContent ?? "";
    expect(probe).toContain('"pathname":"/patient/book"');
    expect(probe).toContain('"doctorId":10');
    expect(probe).toContain('"prefillQuery":"Samuel Chen"');
  });
});