
/** AWS account configuration. */
export interface Account {

  /** AWS Account ID.
   *
   * @example
   * '123456789012'
   */
  readonly id: string;

  /**
   * List of accepted environments for the given account.
   *
   * List of strings or strings representing regexp initialization (passed onto `new Regexp("^"+environment+"$", "i")`).
   *
   * @example
   * ["development", "feature/.*"]
   */
  readonly environments?: string[];

  /** AWS account specific configuration.
   *
   * For example VPC IDs (for existing VPCs), Direct Connect Gateway IDs, apex domain names (for Route53 Zone lookups), etc. Basically configuration for resources that are defined outside of this CDK application.
   *
   * @example
   * {
   *   dev: {
   *     id: '111111111111',
   *     config: {
   *       baseDomain: 'example.net',
   *     },
   *   },
   *   prod: {
   *     id: '222222222222',
   *     config: {
   *       baseDomain: 'example.com',
   *     },
   *   },
   * },
   */
  readonly config?: Record<string, any>;
}

/** Author information. I.e. who owns/develops this project/service. */
export interface Author {

  /** Human-readable name for the organization responsible for this project/service.
   *
   * @example
   * 'Acme Corp'
   */
  readonly organization?: string;

  /** Human-readable name for the team/contact responsible for this project/service.
   *
   * @example
   * 'Mad Scientists'
   */
  readonly name: string;

  /** Email address for the team/contact responsible for this project/service.
   *
   * @example
   * 'mad.scientists@acme.example.com'
   */
  readonly email?: string;
}

export interface ProjectConfiguration {

  /** Name of your project/service.
   *
   * Prefer `hyphen-case`.
   *
   * @example
   * 'my-cool-project'
   */
  readonly name: string;

  /** Author information. I.e. who owns/develops this project/service. */
  readonly author: Author;

  /**
   * Specify default region you wish to use.
   *
   * If left empty will default to one of the following in order:
   * 1. `$CDK_DEFAULT_REGION`
   * 2. `$AWS_REGION`
   * 3. 'us-east-1'
  */
  readonly defaultRegion?: string;

  /** Dictionary of AWS account specific configuration.
   *
   * The key value can be anything (such as AWS Account alias), but it's recommended to keep it short such as `dev` or `prod`.
   *
   * @example
   * accounts: {
   *   dev: {
   *     id: '111111111111',
   *     config: {
   *       baseDomain: 'example.net',
   *     },
   *   },
   *   prod: {
   *     id: '222222222222',
   *     config: {
   *       baseDomain: 'example.com',
   *     },
   *   },
   * },
   * */
  readonly accounts: Record<string, Account>;
}
