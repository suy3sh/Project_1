import {
  getSpecialities,
  getUsersForTable,
  registerUser,
  patchDoctor,
  patchUser,
  deleteUser,
} from "@/services/superService";

import { http } from "@/services/http";

jest.mock("@/services/http", () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedHttp = http as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
  delete: jest.Mock;
};

describe("superService (UNIT)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getSpecialities calls GET /specialities and returns data", async () => {
    mockedHttp.get.mockResolvedValue({
      data: [{ specialityId: 1, specialityName: "Cardiology" }],
    });

    const result = await getSpecialities();

    expect(mockedHttp.get).toHaveBeenCalledWith("/specialities");
    expect(result).toEqual([{ specialityId: 1, specialityName: "Cardiology" }]);
  });

  test("getUsersForTable calls GET /users/table and returns data", async () => {
    mockedHttp.get.mockResolvedValue({
      data: [{ userId: 10, firstName: "Sam", lastName: "Chen", email: "sam@test.com" }],
    });

    const result = await getUsersForTable();

    expect(mockedHttp.get).toHaveBeenCalledWith("/users/table");
    expect(result).toEqual([
      { userId: 10, firstName: "Sam", lastName: "Chen", email: "sam@test.com" },
    ]);
  });

  describe("registerUser", () => {
    test("maps privilege Doctor -> privilegeId 2, posts to /auth/register, returns data", async () => {
      mockedHttp.post.mockResolvedValue({
        data: { userId: 99, message: "ok" },
      });

      const payload: any = {
        firstName: "Ben",
        lastName: "Martinez",
        email: "ben@test.com",
        password: "password",
        privilege: "Doctor",
      };

      const result = await registerUser(payload);

      expect(mockedHttp.post).toHaveBeenCalledWith("/auth/register", {
        firstName: "Ben",
        lastName: "Martinez",
        email: "ben@test.com",
        password: "password",
        privilegeId: 2,
      });

      expect(result).toEqual({ userId: 99, message: "ok" });
    });

    test("maps privilege Admin -> privilegeId 3", async () => {
      mockedHttp.post.mockResolvedValue({ data: { userId: 1 } });

      const payload: any = {
        firstName: "A",
        lastName: "B",
        email: "a@test.com",
        password: "pw",
        privilege: "Admin",
      };

      await registerUser(payload);

      expect(mockedHttp.post).toHaveBeenCalledWith("/auth/register", {
        firstName: "A",
        lastName: "B",
        email: "a@test.com",
        password: "pw",
        privilegeId: 3,
      });
    });

    test("maps privilege Super -> privilegeId 4", async () => {
      mockedHttp.post.mockResolvedValue({ data: { userId: 2 } });

      const payload: any = {
        firstName: "S",
        lastName: "U",
        email: "s@test.com",
        password: "pw",
        privilege: "Super",
      };

      await registerUser(payload);

      expect(mockedHttp.post).toHaveBeenCalledWith("/auth/register", {
        firstName: "S",
        lastName: "U",
        email: "s@test.com",
        password: "pw",
        privilegeId: 4,
      });
    });

    test("unknown privilege keeps privilegeId 0 (default)", async () => {
      mockedHttp.post.mockResolvedValue({ data: { userId: 3 } });

      const payload: any = {
        firstName: "X",
        lastName: "Y",
        email: "x@test.com",
        password: "pw",
        privilege: "Patient", // not mapped in service
      };

      await registerUser(payload);

      expect(mockedHttp.post).toHaveBeenCalledWith("/auth/register", {
        firstName: "X",
        lastName: "Y",
        email: "x@test.com",
        password: "pw",
        privilegeId: 0,
      });
    });
  });

  test("patchDoctor calls PATCH /doctors/:userID with doctor fields only and returns data", async () => {
    mockedHttp.patch.mockResolvedValue({
      data: { doctorId: 10, updated: true },
    });

    const payload: any = {
      firstName: "Ignored",
      lastName: "Ignored",
      email: "ignored@test.com",
      password: "ignored",
      privilege: "Doctor",
      gender: "male",
      speciality: "Cardiology",
      experience: 5,
      bio: "Bio here",
    };

    const result = await patchDoctor(123, payload);

    expect(mockedHttp.patch).toHaveBeenCalledWith("/doctors/123", {
      gender: "male",
      speciality: "Cardiology",
      experience: 5,
      bio: "Bio here",
    });

    expect(result).toEqual({ doctorId: 10, updated: true });
  });

  test("patchUser calls PATCH /users/:userID with user fields only and returns data", async () => {
    mockedHttp.patch.mockResolvedValue({
      data: { userId: 123, firstName: "New", lastName: "Name", email: "new@test.com" },
    });

    const payload: any = {
      firstName: "New",
      lastName: "Name",
      email: "new@test.com",
      password: "ignored",
      privilege: "Doctor",
      gender: "ignored",
      speciality: "ignored",
      experience: 0,
      bio: "ignored",
    };

    const result = await patchUser(123, payload);

    expect(mockedHttp.patch).toHaveBeenCalledWith("/users/123", {
      firstName: "New",
      lastName: "Name",
      email: "new@test.com",
    });

    expect(result).toEqual({
      userId: 123,
      firstName: "New",
      lastName: "Name",
      email: "new@test.com",
    });
  });

  test("deleteUser calls DELETE /users/:userID and returns data", async () => {
    mockedHttp.delete.mockResolvedValue({
      data: { userId: 50, deleted: true },
    });

    const result = await deleteUser(50);

    expect(mockedHttp.delete).toHaveBeenCalledWith("/users/50");
    expect(result).toEqual({ userId: 50, deleted: true });
  });
});
