import { values } from 'lodash';


export function isSet(value?: string | undefined): boolean {
  return (typeof value === 'string' && values.length > 0);
}