import { generateNewValue, trim } from "./trim";

describe("Trim", () => {
  test("generateNewValue", () => {
    const baseName = "MyApplicationTargetGroup";
    const value = `MyCoolProjectStaging${baseName}`;
    const newValue = generateNewValue(value, baseName, { maxLength: 32 });
    expect(newValue).toBe("MyCoolProjectStagingMyApplicaE43");
  });

  test("no need to trim", () => {
    const baseName = "MyApplicationTargetGroup";
    const value = `MyCoolProjectStaging${baseName}`;
    const trimmed = trim(value, baseName, { maxLength: 100 });
    expect(trimmed).toBe(value);
  });

  test("trim not enabled", () => {
    const baseName = "MyApplicationTargetGroup";
    const value = `MyCoolProjectStaging${baseName}`;
    const trimmed = trim(value, baseName, { maxLength: 2 });
    expect(trimmed).toBe(value);
  });

  test("should trim", () => {
    const baseName = "MyApplicationTargetGroup";
    const value = `MyCoolProjectStaging${baseName}`;
    const trimmed = trim(value, baseName, { maxLength: 28, trim: true });
    expect(trimmed).toBe("MyCoolProjectStagingMyAppE43");
  });
});
