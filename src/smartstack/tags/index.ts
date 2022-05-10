import { Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { excludeSpecials } from './exclude';
import { tagAccount, tagEnvironment, tagProject, tagAuthorInfo } from './taggers';
import { resolveTagValues } from './values';

function getTags(scope: Construct): Tags {
  return Tags.of(scope);
}

export function addTags(scope: Construct): void {
  const tags = getTags(scope);
  const values = resolveTagValues(scope);

  tagAccount(scope, tags, values);
  tagEnvironment(scope, tags, values);
  tagProject(scope, tags, values);
  tagAuthorInfo(scope, tags, values);
  excludeSpecials(tags);
}