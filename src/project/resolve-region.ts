const regionRegexp = /^[a-z-]{2,}-[a-z-]{2,}-\d$/;

export function ensureRegionString(value: string | undefined): boolean {
  if (typeof value !== "string") return false;
  return regionRegexp.test(value);
}

export function resolveDefaultRegion(regionProp?: string): string {
  if (ensureRegionString(regionProp)) {
    return <string>regionProp;
  }

  if (ensureRegionString(process.env.CDK_DEFAULT_REGION)) {
    return <string>process.env.CDK_DEFAULT_REGION;
  }

  if (ensureRegionString(process.env.AWS_REGION)) {
    return <string>process.env.AWS_REGION;
  }

  return "us-east-1";
}
