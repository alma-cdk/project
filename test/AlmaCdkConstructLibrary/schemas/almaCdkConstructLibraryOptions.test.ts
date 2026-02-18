import { cdk } from "projen";
import {
  almaCdkConstructLibraryOptionsSchema,
  branchOptionsSchema,
} from "../../../AlmaCdkConstructLibrary/schemas/almaCdkConstructLibraryOptions";

const validBaseOptions = {
  stability: cdk.Stability.STABLE,
  majorVersion: 1,
  author: "Alma Media",
  authorAddress: "opensource@almamedia.dev",
  name: "@alma-cdk/project",
  description: "Test project",
  repositoryUrl: "https://github.com/alma-cdk/project.git",
  releaseEnvironment: "production",
};

describe("branchOptionsSchema", () => {
  it("accepts valid branch options", () => {
    expect(
      branchOptionsSchema.parse({
        majorVersion: 1,
      }),
    ).toEqual({ majorVersion: 1 });

    expect(
      branchOptionsSchema.parse({
        workflowName: "release",
        environment: "production",
        majorVersion: 2,
        tagPrefix: "v",
      }),
    ).toEqual({
      workflowName: "release",
      environment: "production",
      majorVersion: 2,
      tagPrefix: "v",
    });
  });

  it("rejects non-positive majorVersion", () => {
    expect(() => branchOptionsSchema.parse({ majorVersion: 0 })).toThrow();
    expect(() => branchOptionsSchema.parse({ majorVersion: -1 })).toThrow();
  });

  it("rejects non-integer majorVersion", () => {
    expect(() => branchOptionsSchema.parse({ majorVersion: 1.5 })).toThrow();
  });
});

describe("almaCdkConstructLibraryOptionsSchema", () => {
  it("accepts valid full options", () => {
    const result = almaCdkConstructLibraryOptionsSchema.parse(validBaseOptions);
    expect(result.name).toBe("@alma-cdk/project");
    expect(result.repositoryUrl).toBe("https://github.com/alma-cdk/project.git");
    expect(result.minNodeVersion).toBe("20");
    expect(result.workflowNodeVersion).toBe("24");
    expect(result.maxNodeVersion).toBe("24");
  });

  it("applies default Node versions when omitted", () => {
    const result = almaCdkConstructLibraryOptionsSchema.parse(validBaseOptions);
    expect(result.minNodeVersion).toBe("20");
    expect(result.workflowNodeVersion).toBe("24");
    expect(result.maxNodeVersion).toBe("24");
  });

  it("accepts custom Node versions when min <= workflow <= max", () => {
    const result = almaCdkConstructLibraryOptionsSchema.parse({
      ...validBaseOptions,
      minNodeVersion: "18",
      workflowNodeVersion: "20",
      maxNodeVersion: "22",
    });
    expect(result.minNodeVersion).toBe("18");
    expect(result.workflowNodeVersion).toBe("20");
    expect(result.maxNodeVersion).toBe("22");
  });

  it("rejects when min > max", () => {
    expect(() =>
      almaCdkConstructLibraryOptionsSchema.parse({
        ...validBaseOptions,
        minNodeVersion: "22",
        maxNodeVersion: "20",
      }),
    ).toThrow("Node versions must satisfy min <= workflow <= max");
  });

  it("rejects when workflow < min", () => {
    expect(() =>
      almaCdkConstructLibraryOptionsSchema.parse({
        ...validBaseOptions,
        minNodeVersion: "20",
        workflowNodeVersion: "18",
        maxNodeVersion: "24",
      }),
    ).toThrow("Node versions must satisfy min <= workflow <= max");
  });

  it("rejects when workflow > max", () => {
    expect(() =>
      almaCdkConstructLibraryOptionsSchema.parse({
        ...validBaseOptions,
        minNodeVersion: "18",
        workflowNodeVersion: "24",
        maxNodeVersion: "20",
      }),
    ).toThrow("Node versions must satisfy min <= workflow <= max");
  });

  it("rejects invalid name", () => {
    expect(() =>
      almaCdkConstructLibraryOptionsSchema.parse({
        ...validBaseOptions,
        name: "invalid-name",
      }),
    ).toThrow();
  });

  it("rejects invalid repositoryUrl", () => {
    expect(() =>
      almaCdkConstructLibraryOptionsSchema.parse({
        ...validBaseOptions,
        repositoryUrl: "https://gitlab.com/org/repo.git",
      }),
    ).toThrow();
  });

  it("rejects invalid authorAddress (non-email)", () => {
    expect(() =>
      almaCdkConstructLibraryOptionsSchema.parse({
        ...validBaseOptions,
        authorAddress: "not-an-email",
      }),
    ).toThrow();
  });

  it("rejects invalid semver for Node versions", () => {
    expect(() =>
      almaCdkConstructLibraryOptionsSchema.parse({
        ...validBaseOptions,
        minNodeVersion: "not-semver",
      }),
    ).toThrow();
  });

  it("accepts valid releaseBranches", () => {
    const result = almaCdkConstructLibraryOptionsSchema.parse({
      ...validBaseOptions,
      releaseBranches: {
        main: { majorVersion: 1 },
        beta: { majorVersion: 2, prerelease: "beta" },
      },
    });
    expect(result.releaseBranches).toEqual({
      main: { majorVersion: 1 },
      beta: { majorVersion: 2, prerelease: "beta" },
    });
  });
});
