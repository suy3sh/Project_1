import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RegisterWizard from "@/pages/public/Register"; // adjust if your file path differs

import { register, login } from "@/services/authService";
import { patchPatient } from "@/services/patientServices";
import { setTokenGetter } from "@/services/http";
import { getAllergies } from "@/services/allergyService";
import { getBloodType } from "@/services/bloodTypeService";

jest.mock("@/services/authService", () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

jest.mock("@/services/patientServices", () => ({
  patchPatient: jest.fn(),
}));

jest.mock("@/services/http", () => ({
  setTokenGetter: jest.fn(),
  http: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

jest.mock("@/services/allergyService", () => ({
  getAllergies: jest.fn(),
}));

jest.mock("@/services/bloodTypeService", () => ({
  getBloodType: jest.fn(),
}));

/**
 * Test doubles for the forms:
 * - Step 1 form can "fill" the wizard's userForm and click Next.
 * - Step 2 form can "fill" the wizard's patientForm and click Submit.
 *
 * IMPORTANT: These mock specifiers must match the imports in RegisterWizard:
 *   import RegisterForm1 from "../../components/RegisterForm1";
 *   import RegisterForm2 from "../../components/RegisterForm2";
 */
jest.mock("../../components/RegisterForm1", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="register-form-1">
      <div data-testid="step">1</div>

      <button
        type="button"
        onClick={() =>
          props.onChange?.({
            firstName: "Suyesh",
            lastName: "Shrestha",
            email: "tester@mail.com",
            password: "password",
          })
        }
      >
        Fill Step1
      </button>

      <button type="button" onClick={props.onNext}>
        Next
      </button>
    </div>
  ),
}));

jest.mock("../../components/RegisterForm2", () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="register-form-2">
      <div data-testid="step">2</div>

      <div data-testid="allergies-count">{props.allergies?.length ?? 0}</div>
      <div data-testid="bloodtypes-count">{props.bloodTypes?.length ?? 0}</div>

      <button
        type="button"
        onClick={() =>
          props.onChange?.({
            age: "23",
            gender: "male",
            phoneNumber: "1112223333",
            dateOfBirth: "2002-01-01",
            address: "123 Main St",
            bloodType: "O+",
            allergyIds: [1, 3],
          })
        }
      >
        Fill Step2
      </button>

      <button type="button" onClick={props.onSubmit}>
        Submit
      </button>
    </div>
  ),
}));

const mockedRegister = register as jest.MockedFunction<typeof register>;
const mockedLogin = login as jest.MockedFunction<typeof login>;
const mockedPatchPatient = patchPatient as jest.MockedFunction<typeof patchPatient>;
const mockedSetTokenGetter = setTokenGetter as jest.MockedFunction<typeof setTokenGetter>;
const mockedGetAllergies = getAllergies as jest.MockedFunction<typeof getAllergies>;
const mockedGetBloodType = getBloodType as jest.MockedFunction<typeof getBloodType>;

describe("RegisterWizard (INTEGRATION)", () => {
  const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  test("mount: loads allergies and blood types, then Step 1 is shown", async () => {
    mockedGetAllergies.mockResolvedValue([
      { allergyId: 1, name: "Peanuts" } as any,
      { allergyId: 3, name: "Dust" } as any,
    ]);
    mockedGetBloodType.mockResolvedValue([{ bloodTypeId: 1, name: "O+" } as any]);

    render(<RegisterWizard />);

    expect(screen.getByTestId("register-form-1")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedGetAllergies).toHaveBeenCalledTimes(1);
      expect(mockedGetBloodType).toHaveBeenCalledTimes(1);
    });
  });

  test("Step 1 success: register called with form values and wizard advances to Step 2", async () => {
    mockedGetAllergies.mockResolvedValue([]);
    mockedGetBloodType.mockResolvedValue([]);

    mockedRegister.mockResolvedValue({ userId: 777 } as any);

    const user = userEvent.setup();
    render(<RegisterWizard />);

    await user.click(screen.getByRole("button", { name: "Fill Step1" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(mockedRegister).toHaveBeenCalledWith(
        "Suyesh",
        "Shrestha",
        "tester@mail.com",
        "password"
      );
    });

    expect(await screen.findByTestId("register-form-2")).toBeInTheDocument();
  });

  test("Step 1 failure: alerts and stays on Step 1", async () => {
    mockedGetAllergies.mockResolvedValue([]);
    mockedGetBloodType.mockResolvedValue([]);

    mockedRegister.mockRejectedValue(new Error("bad request"));

    const user = userEvent.setup();
    render(<RegisterWizard />);

    await user.click(screen.getByRole("button", { name: "Fill Step1" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("registration failed");
    });

    expect(screen.getByTestId("register-form-1")).toBeInTheDocument();
  });

  test("Step 2 success: login -> setTokenGetter -> patchPatient with computed payload", async () => {
    mockedGetAllergies.mockResolvedValue([
      { allergyId: 1, name: "Peanuts" } as any,
      { allergyId: 2, name: "Shellfish" } as any,
      { allergyId: 3, name: "Dust" } as any,
    ]);
    mockedGetBloodType.mockResolvedValue([{ bloodTypeId: 1, name: "O+" } as any]);

    mockedRegister.mockResolvedValue({ userId: 777 } as any);
    mockedLogin.mockResolvedValue({ token: "fake-token", user: { role: "Patient" } } as any);
    mockedPatchPatient.mockResolvedValue(undefined as any);

    const user = userEvent.setup();
    render(<RegisterWizard />);

    // Step 1 -> Step 2
    await user.click(screen.getByRole("button", { name: "Fill Step1" }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(await screen.findByTestId("register-form-2")).toBeInTheDocument();

    // ensure options loaded into Step2 props
    await waitFor(() => {
      expect(screen.getByTestId("allergies-count")).toHaveTextContent("3");
      expect(screen.getByTestId("bloodtypes-count")).toHaveTextContent("1");
    });

    // Fill step2 + submit
    await user.click(screen.getByRole("button", { name: "Fill Step2" }));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith("tester@mail.com", "password");
    });

    // token getter installed
    expect(mockedSetTokenGetter).toHaveBeenCalledTimes(1);
    expect(typeof mockedSetTokenGetter.mock.calls[0][0]).toBe("function");

    // patch payload includes only selected allergy names from allergyIds [1,3]
    await waitFor(() => {
      expect(mockedPatchPatient).toHaveBeenCalledWith(777, {
        address: "123 Main St",
        age: 23,
        allergies: ["Peanuts", "Dust"],
        bloodType: "O+",
        dateOfBirth: "2002-01-01",
        gender: "male",
        phoneNumber: "1112223333",
      });
    });
  });

  test("Step 2 guard: if userId is missing, alerts and returns to Step 1", async () => {
    mockedGetAllergies.mockResolvedValue([]);
    mockedGetBloodType.mockResolvedValue([]);

    // This forces step=2 with a null userId due to your code setting step(2) after setUserId(res.userId)
    mockedRegister.mockResolvedValue({ userId: null } as any);

    const user = userEvent.setup();
    render(<RegisterWizard />);

    await user.click(screen.getByRole("button", { name: "Fill Step1" }));
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(await screen.findByTestId("register-form-2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(alertSpy).toHaveBeenCalledWith("ERROR: Missing User ID");
    expect(await screen.findByTestId("register-form-1")).toBeInTheDocument();
  });

  test("mount: if allergies/blood types fail to load, alerts", async () => {
    mockedGetAllergies.mockRejectedValue(new Error("boom"));
    mockedGetBloodType.mockResolvedValue([]);

    render(<RegisterWizard />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith("Failed to load allergies or bloodTypes");
    });
  });
});
