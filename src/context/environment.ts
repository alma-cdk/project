import { paramCase } from "change-case";
import { Construct } from "constructs";
import {
  getLabelByName,
  EnvironmentLabel,
  getCategoryByLabel,
  EnvironmentCategory,
} from "../configurations/environments";
import { ProjectContext } from "../project";

export class EnvironmentContext {
  /**
   * Get Environment Name
   *
   * @example
   * 'mock1'
   * 'mock2'
   * 'mock3'
   * 'development'
   * 'feature/foo-bar'
   * 'feature/ABC-123/new-stuff'
   * 'test'
   * 'staging'
   * 'qa1'
   * 'qa2'
   * 'qa3'
   * 'preproduction'
   * 'production'
   *
   * @param scope Construct
   * @returns Environment Name (as given via `--context environment`)
   */
  static getName(scope: Construct): string {
    return ProjectContext.getEnvironment(scope);
  }

  /**
   * Get Environment URL/DNS Compatible Name
   *
   * @example
   * 'mock1'
   * 'mock2'
   * 'mock3'
   * 'development'
   * 'feature-foo-bar'
   * 'feature-abc-123-new-stuff'
   * 'test'
   * 'staging'
   * 'qa1'
   * 'qa2'
   * 'qa3'
   * 'preproduction'
   * 'production'
   *
   * @param scope Construct
   * @returns Environment URL/DNS Compatible Name (as given via `--context environment` but `param-cased`)
   */
  static getUrlName(scope: Construct): string {
    const name = EnvironmentContext.getName(scope);
    return paramCase(name);
  }

  /**
   * Get Environment Label
   *
   * Labels are useful since Environment Name can be complex,
   * such as `feature/foo-bar` or `qa3`,
   * but we need to be able to “label” all `feature/*` and `qaN` environments
   * as either `feature` or `qa`.
   *
   * @example
   * 'mock'
   * 'development'
   * 'feature'
   * 'test'
   * 'staging'
   * 'qa'
   * 'preproduction'
   * 'production'
   *
   * @param scope Construct
   * @returns Environment Label
   */
  static getLabel(scope: Construct): EnvironmentLabel {
    const name = EnvironmentContext.getName(scope);
    return getLabelByName(name);
  }

  /**
   * Get Environment Category
   *
   * Categories are useful grouping to make distinction between `stable`
   * environments (`staging` & `production`) from `feature` or `verification`
   * environments (such as `test` or `preproduction`).
   *
   * @example
   * 'mock'
   * 'development'
   * 'feature'
   * 'verification'
   * 'stable'
   *
   * @param scope Construct
   * @returns Environment Category
   */
  static getCategory(scope: Construct): EnvironmentCategory {
    const label = EnvironmentContext.getLabel(scope);
    return getCategoryByLabel(label);
  }

  /**
   * Check if Environment is part of `mock` category.
   *
   * @param scope Construct
   * @returns boolean indicating does Environment belong to `mock` category
   */
  static isMock(scope: Construct): boolean {
    return EnvironmentContext.isEnvironmentCategoryMatch(
      scope,
      EnvironmentCategory.MOCK,
    );
  }

  /**
   * Check if Environment is part of `development` category.
   *
   * Returns true for `development`, otherwise `false`.
   *
   * @param scope Construct
   * @returns boolean indicating does Environment belong to `development` category
   */
  static isDevelopment(scope: Construct): boolean {
    return EnvironmentContext.isEnvironmentCategoryMatch(
      scope,
      EnvironmentCategory.DEVELOPMENT,
    );
  }

  /**
   * Check if Environment is part of `feature` category.
   *
   * Returns `true` for environments with name beginning with `feature/`-prefix, otherwise `false`.
   *
   * @param scope Construct
   * @returns boolean indicating does Environment belong to `feature` category
   */
  static isFeature(scope: Construct): boolean {
    return EnvironmentContext.isEnvironmentCategoryMatch(
      scope,
      EnvironmentCategory.FEATURE,
    );
  }

  /**
   * Check if Environment is part of `verification` category.
   *
   * Returns `true` for `test` & `preproduction`, otherwise `false`.
   *
   * @param scope Construct
   * @returns boolean indicating does Environment belong to `verification` category
   */
  static isVerification(scope: Construct): boolean {
    return EnvironmentContext.isEnvironmentCategoryMatch(
      scope,
      EnvironmentCategory.VERIFICATION,
    );
  }

  /**
   * Check if Environment is part of `stable` category.
   *
   * Returns `true` for `staging` & `production`, otherwise `false`.
   *
   * @param scope Construct
   * @returns boolean indicating does Environment belong to `stable` category
   */
  static isStable(scope: Construct): boolean {
    return EnvironmentContext.isEnvironmentCategoryMatch(
      scope,
      EnvironmentCategory.STABLE,
    );
  }

  /**
   * Get Feature Info
   *
   * If environment belongs to `feature` category,
   * this will return a string describing the feature (sting after `feature/`-prefix).
   *
   * If environment is not a feature environment, will return an empty string.
   *
   * @param scope Construct
   * @returns string indicating the feature this environment relates to, if not feature environment returns an empty string
   */
  static getFeatureInfo(scope: Construct): string {
    if (EnvironmentContext.isFeature(scope) !== false) return "";
    const name = EnvironmentContext.getName(scope);
    return name.replace(/^feature\//i, "");
  }

  private static isEnvironmentCategoryMatch(
    scope: Construct,
    match: EnvironmentCategory,
  ): boolean {
    const category = EnvironmentContext.getCategory(scope);
    return category === match;
  }
}
