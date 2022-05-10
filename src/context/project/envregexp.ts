

export class EnvRegExp {
  private regexp: RegExp;

  constructor(base: string) {
    this.regexp = new RegExp(`^${base}$`, 'i');
  }

  test(value: string): boolean {
    return this.regexp.test(value);
  }

}
