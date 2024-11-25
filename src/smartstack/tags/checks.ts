import { Values } from "./values";
import { isNonEmptyString } from "../../utils/isNonEmptyString";

export function hasAccount(values: Values): boolean {
  return isNonEmptyString(values.accountType);
}

export function hasEnvironment(values: Values): boolean {
  return isNonEmptyString(values.environmentType);
}
