import { Account, EnvRegExp } from '../project';

export function findAccountTypeByEnvironment(obj: Record<string, Account>, predicate: string): string | undefined {
  const res = Object
    .entries(obj)
    .filter((keyValue) => keyValue[1].environments?.some((environment) => new EnvRegExp(environment).test(predicate)))
    .map(([key]) => key).at(0);

  return res;
}
