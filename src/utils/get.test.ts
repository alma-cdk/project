import { get } from "./get";

describe("Get ProjectContext config value", () => {
  const data = {
    a: {
      b: {
        c: 1,
      },
    },
    d: ["foo", "bar"],
    e: 2,
  };

  const noData = undefined;

  test("get/nodata", () => {
    expect(get(noData, "a")).toBe(undefined);
    expect(get(noData, "a", 999)).toBe(999);
  });

  test("get/data", () => {
    expect(get(data, "e")).toBe(2);
    expect(get(data, "e", 999)).toBe(2);
    expect(get(data, "a.b.c")).toBe(1);
    expect(get(data, "d[0]")).toBe("foo");
    expect(get(data, "f", 999)).toBe(999);
  });
});
