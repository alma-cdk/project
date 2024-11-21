import {
  EnvironmentCategory,
  EnvironmentLabel,
  labelToCategory,
  ENV_REGEXP_MOCK,
  ENV_REGEXP_FEATURE,
  ENV_REGEXP_QA,
  getLabelByName,
  getCategoryByLabel,
} from "./environments";

test("EnvironmentCategory", () => {
  expect(EnvironmentCategory).toMatchSnapshot();
});

test("EnvironmentLabel", () => {
  expect(EnvironmentLabel).toMatchSnapshot();
});

test("labelToCategory", () => {
  expect(labelToCategory).toMatchSnapshot();
});

describe("ENV_REGEXP_*", () => {
  test("ENV_REGEXP_MOCK", () => {
    expect(ENV_REGEXP_MOCK.test("mock1")).toBe(true);
    expect(ENV_REGEXP_MOCK.test("mock2")).toBe(true);
    expect(ENV_REGEXP_MOCK.test("mock3")).toBe(true);
    expect(ENV_REGEXP_MOCK.test("mock4")).toBe(true);
    expect(ENV_REGEXP_MOCK.test("mock5")).toBe(true);
  });

  test("ENV_REGEXP_FEATURE", () => {
    expect(ENV_REGEXP_FEATURE.test("feature/foo")).toBe(true);
    expect(ENV_REGEXP_FEATURE.test("feature/ticket-123/foobar")).toBe(true);
  });

  test("ENV_REGEXP_QA", () => {
    expect(ENV_REGEXP_QA.test("qa1")).toBe(true);
    expect(ENV_REGEXP_QA.test("qa2")).toBe(true);
    expect(ENV_REGEXP_QA.test("qa3")).toBe(true);
    expect(ENV_REGEXP_QA.test("qa4")).toBe(true);
    expect(ENV_REGEXP_QA.test("qa5")).toBe(true);
  });
});

describe("getLabelByName", () => {
  test.each([
    { name: "mock1", expected: EnvironmentLabel.MOCK },
    { name: "feature/foo", expected: EnvironmentLabel.FEATURE },
    { name: "qa1", expected: EnvironmentLabel.QA },
    { name: "development", expected: EnvironmentLabel.DEVELOPMENT },
    { name: "test", expected: EnvironmentLabel.TEST },
    { name: "staging", expected: EnvironmentLabel.STAGING },
    { name: "preproduction", expected: EnvironmentLabel.PREPRODUCTION },
    { name: "production", expected: EnvironmentLabel.PRODUCTION },
  ])("$name", ({ name, expected }) => {
    expect(getLabelByName(name)).toBe(expected);
  });
});

describe("getCategoryByLabel", () => {
  test.each([
    { label: EnvironmentLabel.MOCK, expected: EnvironmentCategory.MOCK },
    {
      label: EnvironmentLabel.DEVELOPMENT,
      expected: EnvironmentCategory.DEVELOPMENT,
    },
    { label: EnvironmentLabel.FEATURE, expected: EnvironmentCategory.FEATURE },
    {
      label: EnvironmentLabel.TEST,
      expected: EnvironmentCategory.VERIFICATION,
    },
    { label: EnvironmentLabel.STAGING, expected: EnvironmentCategory.STABLE },
    { label: EnvironmentLabel.QA, expected: EnvironmentCategory.VERIFICATION },
    {
      label: EnvironmentLabel.PREPRODUCTION,
      expected: EnvironmentCategory.VERIFICATION,
    },
    {
      label: EnvironmentLabel.PRODUCTION,
      expected: EnvironmentCategory.STABLE,
    },
  ])("$label", ({ label, expected }) => {
    expect(getCategoryByLabel(label)).toBe(expected);
  });
});
