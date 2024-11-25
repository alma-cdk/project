import { Tags } from "aws-cdk-lib";
import { tagKey } from "./values";

/*
Prevent tagging of EIP resources since it can cause ec2:disassociateAddress which can break things.
- https://github.com/aws/aws-cdk/issues/5469
- https://github.com/aws-cloudformation/aws-cloudformation-coverage-roadmap/issues/309
*/
const excludeEip = { includeResourceTypes: ["AWS::EC2::EIP"], priority: 300 };

export function excludeSpecials(tags: Tags) {
  for (const k in tagKey) {
    tags.remove(k, excludeEip);
  }
}
