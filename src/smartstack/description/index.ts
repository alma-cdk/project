import { renderTemplate, TemplateContext } from '../../template';

const template = `{# 
    Template for Stack Description prop
    --------------------------------------------------------------------------------
    AWS CloudFormation stack descriptions have a maximum length of 1024 bytes.
    But since we're opinionated, a stack summary should fit into a tweet.
    #}{# 
    
    #}{% if environment | notEmpty %}{# 
      "Staging Environment: "
      #}{{ environment | pascal | stripUnderscore | truncate(32, true, "") | append(" Environment: ") }}{# 
    
    #}{% elif account | notEmpty %}{# 
      "Dev Account: "
      #}{{ account | pascal | truncate(32, true, "") | append(" Account: ") }}{# 
    
    #}{% endif %}{# 
    
    "My description goes here"
    If truncated, an ellipsis is appended: 
    https://mozilla.github.io/nunjucks/templating.html#truncate
    #}{{ body | truncate(280, true)}}`;

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