import * as crypto from 'crypto';
import { NameProps } from './interfaces';
import { decideMaxLength, isTooLong } from './max-length';


export function generateNewValue(value: string, baseName: string, props?: NameProps): string {
  const sha256 = crypto.createHash('sha256').update(baseName);
  const hash = sha256.digest('hex').slice(0, 3);
  const maxLength = decideMaxLength(value, props?.maxLength);
  const newValue = `${value.substring(0, maxLength - 3)}${hash.toUpperCase()}`;
  return newValue;
}

export function trim(value: string, baseName: string, props?: NameProps): string {

  // no need to trim if value not too long
  if (isTooLong(value, props?.maxLength) !== true) return value;

  // don't trim unless explicitly enabled
  if (props?.trim !== true) return value;

  return generateNewValue(value, baseName, props);
}
