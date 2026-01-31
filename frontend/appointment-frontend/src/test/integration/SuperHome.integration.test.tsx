// src/test/integration/SuperHome.integration.test.tsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// IMPORTANT: adjust this import to your actual SuperHome path
import SuperHome from "@/pages/super/SuperHome";

import type { User, Privilege } from "../../types/superTypes";

import {
  deleteUser,
  getUsersForTable,
  patchDoctor,
  patchUser,
  registerUser,
} from "@/services/superService";

jest.mock("@/services/superService", () => ({
  getUsersForTable: jest.fn(),
  registerUser: jest.fn(),
  patchUser: jest.fn(),
  patchDoctor: jest.fn(),
  deleteUser: jest.fn(),
}));

const mockedGetUsersForTable =
  getUsersForTable as jest.MockedFunction<typeof getUsersForTable>;
const mockedRegisterUser =
  registerUser as jest.MockedFunction<typeof registerUser>;
const mockedPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;
const mockedPatchDoctor = patchDoctor as jest.MockedFunction<typeof patchDoctor>;
const mockedDeleteUser = deleteUser as jest.MockedFunction<typeof deleteUser>;

/**
 * Child-component test doubles
 * These expose deterministic buttons to call SuperHome handlers.
 * Note: the mock specifiers MUST match the import strings used in SuperHome.tsx.
 */
jest.mock("../../components/UserTable", () => ({
  __esModule: true,
  UserTable: (props: any) => (
    <div data-testid="user-table">
      <div data-testid="user-count">{props.users?.length ?? 0}</div>

      <div data-testid="first-user-name">
        {props.users?.[0]
          ? `${props.users[0].firstName} ${props.users[0].lastName}`
          : "none"}
      </div>

      <button
        type="button"
        onClick={() => props.onEdit?.(props.users?.[0])}
        disabled={!props.users?.length}
      >
        Edit First
      </button>

      <button
        type="button"
        onClick={() => props.onDelete?.(props.users?.[0])}
        disabled={!props.users?.length}
      >
        Delete First
      </button>
    </div>
  ),
}));

jest.mock("../../components/CreateUserDropdown", () => ({
  __esModule: true,
  CreateUserDropdown: (props: any) => (
    <div data-testid="create-user-dropdown">
      <button type="button" onClick={() => props.onSelect?.("Doctor")}>
        Create Doctor
      </button>
      <button type="button" onClick={() => props.onSelect?.("Admin")}>
        Create Admin
      </button>
      <button type="button" onClick={() => props.onSelect?.("Super")}>
        Create Super
      </button>
    </div>
  ),
}));

jest.mock("../../components/modal/UserModal", () => ({
  __esModule: true,
  UserModal: (props: any) =>
    props.isOpen ? (
      <div data-testid="user-modal">
        <div data-testid="user-modal-mode">{props.user ? "edit" : "create"}</div>
        <div data-testid="initial-privilege">
          {String(props.initialPrivilege)}
        </div>

        <button type="button" onClick={props.onClose}>
          Close UserModal
        </button>

        <button
          type="button"
          onClick={() =>
            props.onSubmit?.({
              firstName: "New",
              lastName: "User",
              email: "new@test.com",
              password: "password",
              privilege: props.initialPrivilege ?? "Doctor",
              // doctor fields
              gender: "male",
              speciality: "Cardiology",
              experience: 5,
              bio: "Bio",
            })
          }
        >
          Submit UserModal
        </button>
      </div>
    ) : null,
}));

jest.mock("../../components/modal/DeleteConfirmModal", () => ({
  __esModule: true,
  DeleteConfirmModal: (props: any) =>
    props.isOpen ? (
      <div data-testid="delete-modal">
        <div data-testid="delete-user-id">{props.user?.userId ?? "none"}</div>
        <button type="button" onClick={props.onClose}>
          Close DeleteModal
        </button>
        <button type="button" onClick={props.onConfirm}>
          Confirm Delete
        </button>
      </div>
    ) : null,
}));

function makeUser(overrides: Partial<User> = {}): User {
  return {
    userId: 1,
    firstName: "Samuel",
    lastName: "Chen",
    email: "sam@test.com",
    privilege: "Doctor",
    speciality: "Cardiology",
    gender: "male",
    experience: 5,
    bio: "Bio",
    ...overrides,
  };
}

describe("SuperHome (INTEGRATION)", () => {
  const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
  const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    alertSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test("loads users on mount and renders header + table counts", async () => {
    mockedGetUsersForTable.mockResolvedValue([
      makeUser({ privilege: "Doctor" }),
      makeUser({
        userId: 2,
        privilege: "Admin",
        firstName: "A",
        lastName: "One",
      }),
      makeUser({
        userId: 3,
        privilege: "Super",
        firstName: "S",
        lastName: "One",
      }),
    ]);

    render(<SuperHome />);

    expect(screen.getByText("Super User Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText("Manage doctors, admins, and super users")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedGetUsersForTable).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("user-count")).toHaveTextContent("3");
    });

    expect(screen.getByText("3 users total")).toBeInTheDocument();
    expect(screen.getByTestId("first-user-name")).toHaveTextContent("Samuel Chen");
  });

  test("alerts if load users fails", async () => {
    mockedGetUsersForTable.mockRejectedValue(new Error("boom"));

    render(<SuperHome />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith("Failed to load users");
    });
  });

  test("create Doctor flow: opens modal -> registerUser -> patchDoctor -> adds new user to table", async () => {
    mockedGetUsersForTable.mockResolvedValue([]);

    mockedRegisterUser.mockResolvedValue({
      userId: 100,
      email: "created@test.com",
    } as any);

    mockedPatchDoctor.mockResolvedValue({
      speciality: { specialityName: "Cardiology" },
      gender: "male",
      experience: 5,
      bio: "Bio",
    } as any);

    const user = userEvent.setup();
    render(<SuperHome />);

    await waitFor(() =>
      expect(mockedGetUsersForTable).toHaveBeenCalledTimes(1)
    );
    expect(screen.getByTestId("user-count")).toHaveTextContent("0");

    await user.click(screen.getByRole("button", { name: "Create Doctor" }));

    expect(screen.getByTestId("user-modal")).toBeInTheDocument();
    expect(screen.getByTestId("user-modal-mode")).toHaveTextContent("create");
    expect(screen.getByTestId("initial-privilege")).toHaveTextContent("Doctor");

    await user.click(screen.getByRole("button", { name: "Submit UserModal" }));

    await waitFor(() => {
      expect(mockedRegisterUser).toHaveBeenCalledTimes(1);
      expect(mockedPatchDoctor).toHaveBeenCalledTimes(1);
    });

    expect(mockedRegisterUser).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "New",
        lastName: "User",
        email: "new@test.com",
        password: "password",
        privilege: "Doctor",
      })
    );

    expect(mockedPatchDoctor).toHaveBeenCalledWith(
      100,
      expect.objectContaining({
        privilege: "Doctor",
        speciality: "Cardiology",
        gender: "male",
        experience: 5,
        bio: "Bio",
      })
    );

    expect(await screen.findByTestId("user-count")).toHaveTextContent("1");
  });

  test("create Admin flow: opens modal -> registerUser -> adds new user without doctor patch", async () => {
    mockedGetUsersForTable.mockResolvedValue([]);

    mockedRegisterUser.mockResolvedValue({
      userId: 101,
      email: "admin@test.com",
    } as any);

    const user = userEvent.setup();
    render(<SuperHome />);

    await waitFor(() =>
      expect(mockedGetUsersForTable).toHaveBeenCalledTimes(1)
    );

    await user.click(screen.getByRole("button", { name: "Create Admin" }));
    expect(screen.getByTestId("initial-privilege")).toHaveTextContent("Admin");

    await user.click(screen.getByRole("button", { name: "Submit UserModal" }));

    await waitFor(() => {
      expect(mockedRegisterUser).toHaveBeenCalledTimes(1);
    });

    // Admin should not call patchDoctor
    expect(mockedPatchDoctor).not.toHaveBeenCalled();

    expect(await screen.findByTestId("user-count")).toHaveTextContent("1");
  });

  test("edit existing Doctor flow: opens modal -> patchUser + patchDoctor called -> users state updated", async () => {
    mockedGetUsersForTable.mockResolvedValue([makeUser({ userId: 7, privilege: "Doctor" })]);

    mockedPatchUser.mockResolvedValue({} as any);
    mockedPatchDoctor.mockResolvedValue({} as any);

    const user = userEvent.setup();
    render(<SuperHome />);

    await waitFor(() => expect(screen.getByTestId("user-count")).toHaveTextContent("1"));

    await user.click(screen.getByRole("button", { name: "Edit First" }));

    expect(screen.getByTestId("user-modal")).toBeInTheDocument();
    expect(screen.getByTestId("user-modal-mode")).toHaveTextContent("edit");

    await user.click(screen.getByRole("button", { name: "Submit UserModal" }));

    await waitFor(() => {
      expect(mockedPatchUser).toHaveBeenCalledTimes(1);
      expect(mockedPatchDoctor).toHaveBeenCalledTimes(1);
    });

    expect(mockedPatchUser).toHaveBeenCalledWith(
      7,
      expect.objectContaining({
        firstName: "New",
        lastName: "User",
        email: "new@test.com",
      })
    );

    expect(mockedPatchDoctor).toHaveBeenCalledWith(
      7,
      expect.objectContaining({
        speciality: "Cardiology",
        gender: "male",
        experience: 5,
        bio: "Bio",
      })
    );

    expect(screen.getByTestId("first-user-name")).toHaveTextContent("New User");
  });

  test("delete flow: opens delete modal -> confirm -> deleteUser called -> user removed", async () => {
    mockedGetUsersForTable.mockResolvedValue([
      makeUser({ userId: 55, privilege: "Admin", firstName: "A", lastName: "One" }),
    ]);

    mockedDeleteUser.mockResolvedValue({} as any);

    const user = userEvent.setup();
    render(<SuperHome />);

    await waitFor(() => expect(screen.getByTestId("user-count")).toHaveTextContent("1"));

    await user.click(screen.getByRole("button", { name: "Delete First" }));
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    expect(screen.getByTestId("delete-user-id")).toHaveTextContent("55");

    await user.click(screen.getByRole("button", { name: "Confirm Delete" }));

    await waitFor(() => {
      expect(mockedDeleteUser).toHaveBeenCalledWith(55);
    });

    expect(screen.getByTestId("user-count")).toHaveTextContent("0");
  });
});