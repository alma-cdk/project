import { pascalCase } from "change-case";
import { Environment } from "nunjucks";

var env = new Environment();

env.addFilter("pascal", function (str: string) {
  return pascalCase(str);
});

env.addFilter("stripUnderscore", function (str: string) {
  return str.replace(/_/g, "");
});

env.addFilter("notEmpty", function (str: string) {
  return typeof str === "string" && str.length > 0;
});

env.addFilter("prepend", function (str: string, leader: string) {
  return `${leader}${str}`;
});

env.addFilter("append", function (str: string, trailer: string) {
  return `${str}${trailer}`;
});

type TemplateContextValue = string | undefined;
export type TemplateContext = Record<string, TemplateContextValue>;

export function renderTemplate<T extends TemplateContext>(
  template: string,
  context: T,
): string {
  return env.renderString(template, context);
}
