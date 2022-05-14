import * as path from 'path';
import { loadTemplate, renderTemplate, TemplateContext } from '../../template';
const template = loadTemplate(path.join(__dirname, 'description.njk'));

interface TemplateProps extends TemplateContext {
  body: string;
  account?: string;
  environment?: string;
}

export interface DescriptionProps {
  body: string;
  accountType?: string;
  environmentType?: string;
}

export function formatDescription(props: DescriptionProps): string {
  const templateContext: TemplateProps = {
    body: props.body,
    account: props.accountType,
    environment: props.environmentType,
  };
  return renderTemplate(template, templateContext);
}