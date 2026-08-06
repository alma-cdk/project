import { Construct } from "constructs";

/**
 * CDK writes its own entries into `node.metadata` – every `Stack` now gets an
 * `aws:cdk:creationStack` entry – so we must only look at the annotation errors
 * instead of the raw metadata array.
 */
const ANNOTATION_METADATA_TYPES = [
  "aws:cdk:error",
  "aws:cdk:warning",
  "aws:cdk:info",
];

function errorMetadata(scope: Construct) {
  return scope.node.metadata.filter((m) =>
    ANNOTATION_METADATA_TYPES.includes(m.type),
  );
}

export function expectErrorMetadata(scope: Construct, matcher?: jest.Expect) {
  if (matcher === undefined) {
    expect(errorMetadata(scope)).toEqual([]);
  } else {
    expect(errorMetadata(scope)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: matcher,
        }),
      ]),
    );
  }
}
