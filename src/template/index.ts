import { readFileSync } from 'fs';
import { pascalCase } from 'change-case';
import { Environment } from 'nunjucks';

var env = new Environment();

env.addFilter('pascal', function(str: string) {
  return pascalCase(str);
});

env.addFilter('stripUnderscore', function(str: string) {
  return str.replace('_', '');
});

env.addFilter('notEmpty', function(str: string) {
  return typeof str === 'string' && str.length > 0;
});

env.addFilter('append', function(str: string, trailer: string) {
  return `${str}${trailer}`;
});


export function loadTemplate(path: string): string {
  return readFileSync(path, 'utf-8').trim();
}

type TemplateContextValue = string | undefined;
export type TemplateContext = Record<string, TemplateContextValue>;

export function renderTemplate<T extends TemplateContext>(template: string, context: T): string {
  return env.renderString(template, context);
}