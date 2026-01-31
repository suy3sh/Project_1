import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import LoginPage from "@/pages/public/Login"; // adjust if needed

import { login as loginAPI } from "@/services/authService";
import { useAuth } from "@/auth/useAuth";

jest.mock("@/services/authService", () => ({
  login: jest.fn(),
}));

jest.mock("@/auth/useAuth", () => ({
  useAuth: jest.fn(),
}));

/**
 * Mock LoginForm so we can deterministically trigger onSubmit without depending on the
 * internal markup of your real form (inputs, labels, etc.).
 *
 * IMPORTANT: the mock specifier must match the import in LoginPage.tsx:
 * import LoginForm from "../../components/LoginForm";
 */
jest.mock("../../components/LoginForm", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="login-form">
      <div data-testid="busy">{String(props.busy)}</div>
      <div data-testid="error">{props.error ?? ""}</div>

      <button
        type="button"
        onClick={() =>
          props.onSubmit?.({
            email: "tester@mail.com",
            password: "password",
          })
        }
      >
        Submit Login
      </button>
    </div>
  ),
}));

const mockedLoginAPI = loginAPI as jest.MockedFunction<typeof loginAPI>;
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<div>Register Page</div>} />
      <Route path="/patient/home" element={<div>Patient Home</div>} />
      <Route path="/doctor/home" element={<div>Doctor Home</div>} />
      <Route path="/admin/home" element={<div>Admin Home</div>} />
      <Route path="/super/home" element={<div>Super Home</div>} />

      {/* Example protected destination */}
      <Route path="/patient/book" element={<div>Patient Book Page</div>} />
    </Routes>
  );
}

describe("LoginPage (INTEGRATION)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("successful login navigates to role home when no redirect 'from' is provided", async () => {
    const user = userEvent.setup();

    const authLogin = jest.fn();
    mockedUseAuth.mockReturnValue({ login: authLogin } as any);

    mockedLoginAPI.mockResolvedValue({
      token: "fake-token",
      user: { role: "Patient" },
    } as any);

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    // Click mocked form submit
    await user.click(screen.getByRole("button", { name: "Submit Login" }));

    await waitFor(() => {
      expect(mockedLoginAPI).toHaveBeenCalledWith("tester@mail.com", "password");
    });

    expect(authLogin).toHaveBeenCalledWith({
      user: { role: "Patient" },
      token: "fake-token",
    });

    // Should land on Patient home
    expect(await screen.findByText("Patient Home")).toBeInTheDocument();
  });

  test("successful login navigates to location.state.from when valid (not '/', not '/login')", async () => {
    const user = userEvent.setup();

    const authLogin = jest.fn();
    mockedUseAuth.mockReturnValue({ login: authLogin } as any);

    mockedLoginAPI.mockResolvedValue({
      token: "fake-token",
      user: { role: "Patient" },
    } as any);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/login",
            state: { from: "/patient/book" },
          } as any,
        ]}
      >
        <AppRoutes />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Submit Login" }));

    await waitFor(() => {
      expect(authLogin).toHaveBeenCalled();
    });

    // Should go to redirect path (from)
    expect(await screen.findByText("Patient Book Page")).toBeInTheDocument();
  });

  test("if location.state.from is '/login' or '/', it falls back to role home", async () => {
    const user = userEvent.setup();

    const authLogin = jest.fn();
    mockedUseAuth.mockReturnValue({ login: authLogin } as any);

    mockedLoginAPI.mockResolvedValue({
      token: "fake-token",
      user: { role: "Doctor" },
    } as any);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/login",
            state: { from: "/login" },
          } as any,
        ]}
      >
        <AppRoutes />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Submit Login" }));

    // Falls back to Doctor home
    expect(await screen.findByText("Doctor Home")).toBeInTheDocument();
  });

  test("failed login shows error message and does not navigate to home", async () => {
    const user = userEvent.setup();

    const authLogin = jest.fn();
    mockedUseAuth.mockReturnValue({ login: authLogin } as any);

    mockedLoginAPI.mockRejectedValue(new Error("bad credentials"));

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Submit Login" }));

    await waitFor(() => {
      // Error should be displayed via LoginForm props
      expect(screen.getByTestId("error")).toHaveTextContent(
        "Login failed. Please check your credentials and try again."
      );
    });

    expect(authLogin).not.toHaveBeenCalled();
    expect(screen.queryByText("Patient Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Doctor Home")).not.toBeInTheDocument();
  });

  test("clicking Sign up navigates to /register", async () => {
    const user = userEvent.setup();

    mockedUseAuth.mockReturnValue({ login: jest.fn() } as any);
    mockedLoginAPI.mockResolvedValue({
      token: "fake-token",
      user: { role: "Patient" },
    } as any);

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /sign up/i }));
    expect(await screen.findByText("Register Page")).toBeInTheDocument();
  });
});