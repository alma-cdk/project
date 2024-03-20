import { isNonEmptyString } from '../../utils/isSet';

export interface TerminationProtectionProps {
  override?: boolean;
  environmentType?: string;
}

function isEnvironmental(environmentType?: string): boolean {
  return isNonEmptyString(environmentType);
}

function isStagingProduction(environmentType?: string): boolean {
  return /^(staging|production)$/.test(environmentType || ''); // TODO: should this use isStable?
}

export function decideTerminationProtection(props: TerminationProtectionProps): boolean {

  // allow explicit override from end-user
  if (typeof props.override === 'boolean') return props.override;

  // non-environmental stacks always have termination protection
  if (!isEnvironmental(props.environmentType)) return true;

  // finally decide based on if staging/production or other
  return isStagingProduction(props.environmentType);
}
