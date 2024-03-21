import { Account, EnvRegExp } from '../project';

export function findAccountTypeByEnvironment(obj: Record<string, Account>, predicate: string): string | undefined {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key].environments?.some((environment) => new EnvRegExp(environment).test(predicate))) {
        return key;
      }
    }
  }
  return undefined;
}
