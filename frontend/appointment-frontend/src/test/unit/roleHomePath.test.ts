import { roleHomePath } from "@/utils/roleHomePath";
import { Role } from "@/components/NavBar/types";

describe("roleHomePath (UNIT TEST)", () => {
  test("returns patient home path", () => {
    const role: Role = "Patient";
    expect(roleHomePath(role)).toBe("/patient/home");
  });

  test("returns doctor home path", () => {
    const role: Role = "Doctor";
    expect(roleHomePath(role)).toBe("/doctor/home");
  });

  test("returns admin home path", () => {
    const role: Role = "Admin";
    expect(roleHomePath(role)).toBe("/admin/home");
  });

  test("returns super home path", () => {
    const role: Role = "Super";
    expect(roleHomePath(role)).toBe("/super/home");
  });

  test("returns default path for unknown role", () => {
    expect(roleHomePath("Unknown" as Role)).toBe("/");
  });
});