import { Construct } from "constructs";

export function expectErrorMetadata(scope: Construct, matcher?: jest.Expect) {
  if (matcher === undefined) {
    expect(scope.node.metadata).toEqual([]);
  } else {
    expect(scope.node.metadata).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: matcher,
        }),
      ]),
    );
  }
}
