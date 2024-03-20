
export function get(obj: Record<string, any> | undefined, path: string, defValue?: any): any {
  // If path is not defined or it has false value
  if (!path) return undefined;
  // Check if path is string or array. Regex : ensure that we do not have '.' and brackets.
  // Regex explained: https://regexr.com/58j0k
  const pathArray = path.match(/([^[.\]])+/g);
  // Find value
  const result = pathArray?.reduce((prevObj, key) => {
    return prevObj && prevObj[key];
  }, obj);
  // If found value is undefined return default value; otherwise return the value
  return result === undefined ? defValue : result;
}
