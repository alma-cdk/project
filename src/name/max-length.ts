import { Annotations } from 'aws-cdk-lib';
import { Construct } from 'constructs';


export const MAX_LENGTH_DEFAULT = 63;
export const MAX_LENGTH_PATH = 900;

function isPathValue(value: string): boolean {
  return value.indexOf('/') === 0;
}

export function decideMaxLength(value: string, maxLengthProp?: number): number {
  if (typeof maxLengthProp === 'number') return maxLengthProp;
  if (isPathValue(value)) return MAX_LENGTH_PATH;
  return MAX_LENGTH_DEFAULT;
}

export function isTooLong(value: string, maxLength?: number): boolean {
  const max = decideMaxLength(value, maxLength);
  return value.length > max;
}

export function validateMaxLength(scope: Construct, value: string, maxLength?: number): void {
  if (isTooLong(value, maxLength)) {
    Annotations.of(scope).addError(`Name value "${value}" is longer than the allowed limit of ${maxLength}`);
  }
}
