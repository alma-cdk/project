import { cdk } from "projen";
import { Testing } from "projen/lib/testing";
import { AlmaCdkConstructLibrary } from "../../AlmaCdkConstructLibrary/AlmaCdkConstructLibrary";

test("snapshot", () => {
  const project = new AlmaCdkConstructLibrary({
    stability: cdk.Stability.STABLE,
    majorVersion: 1,
    author: "Alma Media",
    authorAddress: "opensource@almamedia.dev",
    name: "@alma-cdk/project",
    description: 'Opinionated CDK Project "Framework"',
    repositoryUrl: "https://github.com/alma-cdk/project.git",
    releaseEnvironment: "production",
  });
  const snapshot = Testing.synth(project);
  expect(snapshot).toMatchSnapshot();
});
