import { nameSchema, parseScopedPackageName } from "../../../AlmaCdkConstructLibrary/schemas/name";

describe("nameSchema", () => {
  it("accepts valid scoped package names", () => {
    expect(nameSchema.parse("@scope/package")).toBe("@scope/package");
    expect(nameSchema.parse("@alma-cdk/project")).toBe("@alma-cdk/project");
    expect(nameSchema.parse("@foo/bar-baz")).toBe("@foo/bar-baz");
  });

  it("rejects empty string", () => {
    expect(() => nameSchema.parse("")).toThrow();
  });

  it("rejects names without @", () => {
    expect(() => nameSchema.parse("scope/package")).toThrow();
  });

  it("rejects names without exactly one slash", () => {
    expect(() => nameSchema.parse("@scope")).toThrow();
    expect(() => nameSchema.parse("@scope/pkg/sub")).toThrow();
  });

  it("rejects names with no slash", () => {
    expect(() => nameSchema.parse("@scopepackage")).toThrow();
  });
});

describe("parseScopedPackageName", () => {
  it("parses scope and package name", () => {
    expect(parseScopedPackageName("@scope/package")).toEqual({
      scope: "scope",
      packageName: "package",
    });
    expect(parseScopedPackageName("@alma-cdk/project")).toEqual({
      scope: "alma-cdk",
      packageName: "project",
    });
  });
});
