export function get(
  obj: Record<string, any> | undefined,
  path: string,
  defValue?: any,
): any {
  // Regex explained: https://regexr.com/58j0k
  const pathArray = path.match(/([^[.\]])+/g);
  const result = pathArray?.reduce((prevObj, key) => {
    return prevObj && prevObj[key];
  }, obj);

  return result === undefined ? defValue : result;
}
