import { isValidEmail, isStrongPassword } from "@/utils/validators";

describe("validators (UNIT TEST)", () => {
  test("isValidEmail returns true for valid emails", () => {
    expect(isValidEmail("tester@mail.com")).toBe(true);
    expect(isValidEmail("a.b+c@test.co")).toBe(true);
  });

  test("isValidEmail returns false for invalid emails", () => {
    expect(isValidEmail("tester")).toBe(false);
    expect(isValidEmail("tester@")).toBe(false);
    expect(isValidEmail("@mail.com")).toBe(false);
  });

  test("isStrongPassword returns true for strong passwords", () => {
    expect(isStrongPassword("StrongP@ssw0rd")).toBe(true);
  });

  test("isStrongPassword returns false for weak passwords", () => {
    expect(isStrongPassword("password")).toBe(false);
    expect(isStrongPassword("short1!")).toBe(false);
  });
});