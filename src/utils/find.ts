import { Account, EnvRegExp } from '../project';

export function findAccountTypeByEnvironment(obj: Record<string, Account>, predicate: string): string | undefined {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const list = obj[key].environments?.filter((environment) => new EnvRegExp(environment).test(predicate));
      if (Array.isArray(list) && list.length > 0) {
        return key;
      }
    }
  }
  return undefined;
}
