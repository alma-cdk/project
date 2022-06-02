class EnvRegExp {
  private regexp: RegExp;

  constructor(base: string) {
    this.regexp = new RegExp(`^${base}$`, 'i');
  }

  test(value: string): boolean {
    return this.regexp.test(value);
  }

}


/**
 * Availalbe Enviroment Categories.
 *
 * Categories are useful grouping to make distinction between `stable`
 * environments (`staging` & `production`) from `feature` or `verification`
 * environments (such as `test` or `preproduction`).
 */
export enum EnvironmentCategory {
  MOCK = 'mock',
  DEVELOPMENT = 'development',
  FEATURE = 'feature',
  VERIFICATION = 'verification',
  STABLE = 'stable',
}

/**
 * Available Environment Labels.
 *
 * Labels are useful since Environment Name can be complex,
 * such as `feature/foo-bar` or `qa3`,
 * but we need to be able to “label” all `feature/*` and `qaN` environments
 * as either `feature` or `qa`.
 */
export enum EnvironmentLabel {
  MOCK='mock[0-9]',
  DEVELOPMENT='development',
  FEATURE='feature/[/a-zA-z0-9-]+',
  TEST='test', // replaces "prestaging"
  STAGING='staging',
  QA='qa[0-9]',
  PREPRODUCTION='preproduction',
  PRODUCTION='production',
}

/**
 * Map Environment Type to Environment Category.
 * I.e. `staging` and `production` are considered being `stable` environments.
 */
export const labelToCategory: Record<EnvironmentLabel, EnvironmentCategory> = {
  [EnvironmentLabel.MOCK]: EnvironmentCategory.MOCK,
  [EnvironmentLabel.DEVELOPMENT]: EnvironmentCategory.DEVELOPMENT,
  [EnvironmentLabel.FEATURE]: EnvironmentCategory.FEATURE,
  [EnvironmentLabel.TEST]: EnvironmentCategory.VERIFICATION,
  [EnvironmentLabel.STAGING]: EnvironmentCategory.STABLE,
  [EnvironmentLabel.QA]: EnvironmentCategory.VERIFICATION,
  [EnvironmentLabel.PREPRODUCTION]: EnvironmentCategory.VERIFICATION,
  [EnvironmentLabel.PRODUCTION]: EnvironmentCategory.STABLE,
};


const ENV_REGEXP_MOCK = new EnvRegExp(EnvironmentLabel.MOCK);
const ENV_REGEXP_FEATURE = new EnvRegExp(EnvironmentLabel.FEATURE);
const ENV_REGEXP_QA = new EnvRegExp(EnvironmentLabel.QA);

/**
 * TODO document
 */
export function getLabelByName(name: string): EnvironmentLabel {
  if (ENV_REGEXP_MOCK.test(name)) return EnvironmentLabel.MOCK;
  if (ENV_REGEXP_FEATURE.test(name)) return EnvironmentLabel.FEATURE;
  if (ENV_REGEXP_QA.test(name)) return EnvironmentLabel.QA;
  return <EnvironmentLabel>name;
}

/**
 * TODO document
 */
export function getCategoryByLabel(label: EnvironmentLabel): EnvironmentCategory {
  return labelToCategory[label];
}


