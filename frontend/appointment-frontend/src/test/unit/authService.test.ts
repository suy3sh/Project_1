import { http } from "@/services/http";
import { login } from "@/services/authService";

// Mock http.post
jest.mock("@/services/http", () => ({
  http: {
    post: jest.fn(),
  },
}));

describe("authService.login (UNIT TEST)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls login API with correct email and password", async () => {
    (http.post as jest.Mock).mockResolvedValue({
      data: {
        token: "fake-token",
        privilege: {
          roleName: "Patient",
        },
      },
    });

    const result = await login("tester@mail.com", "password");

    expect(http.post).toHaveBeenCalledWith("/auth/login", {
      email: "tester@mail.com",
      password: "password",
    });

    expect(result).toEqual({
      token: "fake-token",
      user: { role: "Patient" },
    });
  });

  it("throws an error when API fails", async () => {
    (http.post as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    await expect(
      login("tester@mail.com", "password")
    ).rejects.toThrow("Network error");
  });
});