import { repositoryUrlSchema } from "../../../AlmaCdkConstructLibrary/schemas/repositoryUrl";

describe("repositoryUrlSchema", () => {
  it("accepts valid GitHub repository URLs", () => {
    expect(repositoryUrlSchema.parse("https://github.com/alma-cdk/project.git")).toBe(
      "https://github.com/alma-cdk/project.git",
    );
    expect(repositoryUrlSchema.parse("https://github.com/org/repo.git")).toBe(
      "https://github.com/org/repo.git",
    );
  });

  it("rejects non-URLs", () => {
    expect(() => repositoryUrlSchema.parse("not-a-url")).toThrow();
  });

  it("rejects URLs not starting with https://github.com/", () => {
    expect(() =>
      repositoryUrlSchema.parse("https://gitlab.com/org/repo.git"),
    ).toThrow();
    expect(() =>
      repositoryUrlSchema.parse("https://github.com/org/repo"),
    ).toThrow();
  });

  it("rejects URLs not ending with .git", () => {
    expect(() =>
      repositoryUrlSchema.parse("https://github.com/org/repo"),
    ).toThrow();
  });
});
