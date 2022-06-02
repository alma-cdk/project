# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### SmartStack <a name="SmartStack" id="@alma-cdk/project.SmartStack"></a>

#### Initializers <a name="Initializers" id="@alma-cdk/project.SmartStack.Initializer"></a>

```typescript
import { SmartStack } from '@alma-cdk/project'

new SmartStack(scope: Construct, id: string, props: StackProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@alma-cdk/project.SmartStack.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@alma-cdk/project.SmartStack.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@alma-cdk/project.SmartStack.Initializer.parameter.props">props</a></code> | <code>aws-cdk-lib.StackProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.SmartStack.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@alma-cdk/project.SmartStack.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@alma-cdk/project.SmartStack.Initializer.parameter.props"></a>

- *Type:* aws-cdk-lib.StackProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@alma-cdk/project.SmartStack.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@alma-cdk/project.SmartStack.addDependency">addDependency</a></code> | Add a dependency between this stack and another stack. |
| <code><a href="#@alma-cdk/project.SmartStack.addTransform">addTransform</a></code> | Add a Transform to this stack. A Transform is a macro that AWS CloudFormation uses to process your template. |
| <code><a href="#@alma-cdk/project.SmartStack.exportValue">exportValue</a></code> | Create a CloudFormation Export for a value. |
| <code><a href="#@alma-cdk/project.SmartStack.formatArn">formatArn</a></code> | Creates an ARN from components. |
| <code><a href="#@alma-cdk/project.SmartStack.getLogicalId">getLogicalId</a></code> | Allocates a stack-unique CloudFormation-compatible logical identity for a specific resource. |
| <code><a href="#@alma-cdk/project.SmartStack.regionalFact">regionalFact</a></code> | Look up a fact value for the given fact for the region of this stack. |
| <code><a href="#@alma-cdk/project.SmartStack.renameLogicalId">renameLogicalId</a></code> | Rename a generated logical identities. |
| <code><a href="#@alma-cdk/project.SmartStack.reportMissingContextKey">reportMissingContextKey</a></code> | Indicate that a context key was expected. |
| <code><a href="#@alma-cdk/project.SmartStack.resolve">resolve</a></code> | Resolve a tokenized value in the context of the current stack. |
| <code><a href="#@alma-cdk/project.SmartStack.splitArn">splitArn</a></code> | Splits the provided ARN into its components. |
| <code><a href="#@alma-cdk/project.SmartStack.toJsonString">toJsonString</a></code> | Convert an object, potentially containing tokens, to a JSON string. |

---

##### `toString` <a name="toString" id="@alma-cdk/project.SmartStack.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addDependency` <a name="addDependency" id="@alma-cdk/project.SmartStack.addDependency"></a>

```typescript
public addDependency(target: Stack, reason?: string): void
```

Add a dependency between this stack and another stack.

This can be used to define dependencies between any two stacks within an
app, and also supports nested stacks.

###### `target`<sup>Required</sup> <a name="target" id="@alma-cdk/project.SmartStack.addDependency.parameter.target"></a>

- *Type:* aws-cdk-lib.Stack

---

###### `reason`<sup>Optional</sup> <a name="reason" id="@alma-cdk/project.SmartStack.addDependency.parameter.reason"></a>

- *Type:* string

---

##### `addTransform` <a name="addTransform" id="@alma-cdk/project.SmartStack.addTransform"></a>

```typescript
public addTransform(transform: string): void
```

Add a Transform to this stack. A Transform is a macro that AWS CloudFormation uses to process your template.

Duplicate values are removed when stack is synthesized.

> [https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/transform-section-structure.html)

*Example*

```typescript
declare const stack: Stack;

stack.addTransform('AWS::Serverless-2016-10-31')
```


###### `transform`<sup>Required</sup> <a name="transform" id="@alma-cdk/project.SmartStack.addTransform.parameter.transform"></a>

- *Type:* string

The transform to add.

---

##### `exportValue` <a name="exportValue" id="@alma-cdk/project.SmartStack.exportValue"></a>

```typescript
public exportValue(exportedValue: any, options?: ExportValueOptions): string
```

Create a CloudFormation Export for a value.

Returns a string representing the corresponding `Fn.importValue()`
expression for this Export. You can control the name for the export by
passing the `name` option.

If you don't supply a value for `name`, the value you're exporting must be
a Resource attribute (for example: `bucket.bucketName`) and it will be
given the same name as the automatic cross-stack reference that would be created
if you used the attribute in another Stack.

One of the uses for this method is to *remove* the relationship between
two Stacks established by automatic cross-stack references. It will
temporarily ensure that the CloudFormation Export still exists while you
remove the reference from the consuming stack. After that, you can remove
the resource and the manual export.

## Example

Here is how the process works. Let's say there are two stacks,
`producerStack` and `consumerStack`, and `producerStack` has a bucket
called `bucket`, which is referenced by `consumerStack` (perhaps because
an AWS Lambda Function writes into it, or something like that).

It is not safe to remove `producerStack.bucket` because as the bucket is being
deleted, `consumerStack` might still be using it.

Instead, the process takes two deployments:

### Deployment 1: break the relationship

- Make sure `consumerStack` no longer references `bucket.bucketName` (maybe the consumer
   stack now uses its own bucket, or it writes to an AWS DynamoDB table, or maybe you just
   remove the Lambda Function altogether).
- In the `ProducerStack` class, call `this.exportValue(this.bucket.bucketName)`. This
   will make sure the CloudFormation Export continues to exist while the relationship
   between the two stacks is being broken.
- Deploy (this will effectively only change the `consumerStack`, but it's safe to deploy both).

### Deployment 2: remove the bucket resource

- You are now free to remove the `bucket` resource from `producerStack`.
- Don't forget to remove the `exportValue()` call as well.
- Deploy again (this time only the `producerStack` will be changed -- the bucket will be deleted).

###### `exportedValue`<sup>Required</sup> <a name="exportedValue" id="@alma-cdk/project.SmartStack.exportValue.parameter.exportedValue"></a>

- *Type:* any

---

###### `options`<sup>Optional</sup> <a name="options" id="@alma-cdk/project.SmartStack.exportValue.parameter.options"></a>

- *Type:* aws-cdk-lib.ExportValueOptions

---

##### `formatArn` <a name="formatArn" id="@alma-cdk/project.SmartStack.formatArn"></a>

```typescript
public formatArn(components: ArnComponents): string
```

Creates an ARN from components.

If `partition`, `region` or `account` are not specified, the stack's
partition, region and account will be used.

If any component is the empty string, an empty string will be inserted
into the generated ARN at the location that component corresponds to.

The ARN will be formatted as follows:

   arn:{partition}:{service}:{region}:{account}:{resource}{sep}}{resource-name}

The required ARN pieces that are omitted will be taken from the stack that
the 'scope' is attached to. If all ARN pieces are supplied, the supplied scope
can be 'undefined'.

###### `components`<sup>Required</sup> <a name="components" id="@alma-cdk/project.SmartStack.formatArn.parameter.components"></a>

- *Type:* aws-cdk-lib.ArnComponents

---

##### `getLogicalId` <a name="getLogicalId" id="@alma-cdk/project.SmartStack.getLogicalId"></a>

```typescript
public getLogicalId(element: CfnElement): string
```

Allocates a stack-unique CloudFormation-compatible logical identity for a specific resource.

This method is called when a `CfnElement` is created and used to render the
initial logical identity of resources. Logical ID renames are applied at
this stage.

This method uses the protected method `allocateLogicalId` to render the
logical ID for an element. To modify the naming scheme, extend the `Stack`
class and override this method.

###### `element`<sup>Required</sup> <a name="element" id="@alma-cdk/project.SmartStack.getLogicalId.parameter.element"></a>

- *Type:* aws-cdk-lib.CfnElement

The CloudFormation element for which a logical identity is needed.

---

##### `regionalFact` <a name="regionalFact" id="@alma-cdk/project.SmartStack.regionalFact"></a>

```typescript
public regionalFact(factName: string, defaultValue?: string): string
```

Look up a fact value for the given fact for the region of this stack.

Will return a definite value only if the region of the current stack is resolved.
If not, a lookup map will be added to the stack and the lookup will be done at
CDK deployment time.

What regions will be included in the lookup map is controlled by the
`@aws-cdk/core:target-partitions` context value: it must be set to a list
of partitions, and only regions from the given partitions will be included.
If no such context key is set, all regions will be included.

This function is intended to be used by construct library authors. Application
builders can rely on the abstractions offered by construct libraries and do
not have to worry about regional facts.

If `defaultValue` is not given, it is an error if the fact is unknown for
the given region.

###### `factName`<sup>Required</sup> <a name="factName" id="@alma-cdk/project.SmartStack.regionalFact.parameter.factName"></a>

- *Type:* string

---

###### `defaultValue`<sup>Optional</sup> <a name="defaultValue" id="@alma-cdk/project.SmartStack.regionalFact.parameter.defaultValue"></a>

- *Type:* string

---

##### `renameLogicalId` <a name="renameLogicalId" id="@alma-cdk/project.SmartStack.renameLogicalId"></a>

```typescript
public renameLogicalId(oldId: string, newId: string): void
```

Rename a generated logical identities.

To modify the naming scheme strategy, extend the `Stack` class and
override the `allocateLogicalId` method.

###### `oldId`<sup>Required</sup> <a name="oldId" id="@alma-cdk/project.SmartStack.renameLogicalId.parameter.oldId"></a>

- *Type:* string

---

###### `newId`<sup>Required</sup> <a name="newId" id="@alma-cdk/project.SmartStack.renameLogicalId.parameter.newId"></a>

- *Type:* string

---

##### `reportMissingContextKey` <a name="reportMissingContextKey" id="@alma-cdk/project.SmartStack.reportMissingContextKey"></a>

```typescript
public reportMissingContextKey(report: MissingContext): void
```

Indicate that a context key was expected.

Contains instructions which will be emitted into the cloud assembly on how
the key should be supplied.

###### `report`<sup>Required</sup> <a name="report" id="@alma-cdk/project.SmartStack.reportMissingContextKey.parameter.report"></a>

- *Type:* aws-cdk-lib.cloud_assembly_schema.MissingContext

The set of parameters needed to obtain the context.

---

##### `resolve` <a name="resolve" id="@alma-cdk/project.SmartStack.resolve"></a>

```typescript
public resolve(obj: any): any
```

Resolve a tokenized value in the context of the current stack.

###### `obj`<sup>Required</sup> <a name="obj" id="@alma-cdk/project.SmartStack.resolve.parameter.obj"></a>

- *Type:* any

---

##### `splitArn` <a name="splitArn" id="@alma-cdk/project.SmartStack.splitArn"></a>

```typescript
public splitArn(arn: string, arnFormat: ArnFormat): ArnComponents
```

Splits the provided ARN into its components.

Works both if 'arn' is a string like 'arn:aws:s3:::bucket',
and a Token representing a dynamic CloudFormation expression
(in which case the returned components will also be dynamic CloudFormation expressions,
encoded as Tokens).

###### `arn`<sup>Required</sup> <a name="arn" id="@alma-cdk/project.SmartStack.splitArn.parameter.arn"></a>

- *Type:* string

the ARN to split into its components.

---

###### `arnFormat`<sup>Required</sup> <a name="arnFormat" id="@alma-cdk/project.SmartStack.splitArn.parameter.arnFormat"></a>

- *Type:* aws-cdk-lib.ArnFormat

the expected format of 'arn' - depends on what format the service 'arn' represents uses.

---

##### `toJsonString` <a name="toJsonString" id="@alma-cdk/project.SmartStack.toJsonString"></a>

```typescript
public toJsonString(obj: any, space?: number): string
```

Convert an object, potentially containing tokens, to a JSON string.

###### `obj`<sup>Required</sup> <a name="obj" id="@alma-cdk/project.SmartStack.toJsonString.parameter.obj"></a>

- *Type:* any

---

###### `space`<sup>Optional</sup> <a name="space" id="@alma-cdk/project.SmartStack.toJsonString.parameter.space"></a>

- *Type:* number

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@alma-cdk/project.SmartStack.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@alma-cdk/project.SmartStack.isStack">isStack</a></code> | Return whether the given object is a Stack. |
| <code><a href="#@alma-cdk/project.SmartStack.of">of</a></code> | Looks up the first stack scope in which `construct` is defined. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@alma-cdk/project.SmartStack.isConstruct"></a>

```typescript
import { SmartStack } from '@alma-cdk/project'

SmartStack.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@alma-cdk/project.SmartStack.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isStack` <a name="isStack" id="@alma-cdk/project.SmartStack.isStack"></a>

```typescript
import { SmartStack } from '@alma-cdk/project'

SmartStack.isStack(x: any)
```

Return whether the given object is a Stack.

We do attribute detection since we can't reliably use 'instanceof'.

###### `x`<sup>Required</sup> <a name="x" id="@alma-cdk/project.SmartStack.isStack.parameter.x"></a>

- *Type:* any

---

##### `of` <a name="of" id="@alma-cdk/project.SmartStack.of"></a>

```typescript
import { SmartStack } from '@alma-cdk/project'

SmartStack.of(construct: IConstruct)
```

Looks up the first stack scope in which `construct` is defined.

Fails if there is no stack up the tree.

###### `construct`<sup>Required</sup> <a name="construct" id="@alma-cdk/project.SmartStack.of.parameter.construct"></a>

- *Type:* constructs.IConstruct

The construct to start the search from.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@alma-cdk/project.SmartStack.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@alma-cdk/project.SmartStack.property.account">account</a></code> | <code>string</code> | The AWS account into which this stack will be deployed. |
| <code><a href="#@alma-cdk/project.SmartStack.property.artifactId">artifactId</a></code> | <code>string</code> | The ID of the cloud assembly artifact for this stack. |
| <code><a href="#@alma-cdk/project.SmartStack.property.availabilityZones">availabilityZones</a></code> | <code>string[]</code> | Returns the list of AZs that are available in the AWS environment (account/region) associated with this stack. |
| <code><a href="#@alma-cdk/project.SmartStack.property.bundlingRequired">bundlingRequired</a></code> | <code>boolean</code> | Indicates whether the stack requires bundling or not. |
| <code><a href="#@alma-cdk/project.SmartStack.property.dependencies">dependencies</a></code> | <code>aws-cdk-lib.Stack[]</code> | Return the stacks this stack depends on. |
| <code><a href="#@alma-cdk/project.SmartStack.property.environment">environment</a></code> | <code>string</code> | The environment coordinates in which this stack is deployed. |
| <code><a href="#@alma-cdk/project.SmartStack.property.nested">nested</a></code> | <code>boolean</code> | Indicates if this is a nested stack, in which case `parentStack` will include a reference to it's parent. |
| <code><a href="#@alma-cdk/project.SmartStack.property.notificationArns">notificationArns</a></code> | <code>string[]</code> | Returns the list of notification Amazon Resource Names (ARNs) for the current stack. |
| <code><a href="#@alma-cdk/project.SmartStack.property.partition">partition</a></code> | <code>string</code> | The partition in which this stack is defined. |
| <code><a href="#@alma-cdk/project.SmartStack.property.region">region</a></code> | <code>string</code> | The AWS region into which this stack will be deployed (e.g. `us-west-2`). |
| <code><a href="#@alma-cdk/project.SmartStack.property.stackId">stackId</a></code> | <code>string</code> | The ID of the stack. |
| <code><a href="#@alma-cdk/project.SmartStack.property.stackName">stackName</a></code> | <code>string</code> | The concrete CloudFormation physical stack name. |
| <code><a href="#@alma-cdk/project.SmartStack.property.synthesizer">synthesizer</a></code> | <code>aws-cdk-lib.IStackSynthesizer</code> | Synthesis method for this stack. |
| <code><a href="#@alma-cdk/project.SmartStack.property.tags">tags</a></code> | <code>aws-cdk-lib.TagManager</code> | Tags to be applied to the stack. |
| <code><a href="#@alma-cdk/project.SmartStack.property.templateFile">templateFile</a></code> | <code>string</code> | The name of the CloudFormation template file emitted to the output directory during synthesis. |
| <code><a href="#@alma-cdk/project.SmartStack.property.templateOptions">templateOptions</a></code> | <code>aws-cdk-lib.ITemplateOptions</code> | Options for CloudFormation template (like version, transform, description). |
| <code><a href="#@alma-cdk/project.SmartStack.property.urlSuffix">urlSuffix</a></code> | <code>string</code> | The Amazon domain suffix for the region in which this stack is defined. |
| <code><a href="#@alma-cdk/project.SmartStack.property.nestedStackParent">nestedStackParent</a></code> | <code>aws-cdk-lib.Stack</code> | If this is a nested stack, returns it's parent stack. |
| <code><a href="#@alma-cdk/project.SmartStack.property.nestedStackResource">nestedStackResource</a></code> | <code>aws-cdk-lib.CfnResource</code> | If this is a nested stack, this represents its `AWS::CloudFormation::Stack` resource. |
| <code><a href="#@alma-cdk/project.SmartStack.property.terminationProtection">terminationProtection</a></code> | <code>boolean</code> | Whether termination protection is enabled for this stack. |

---

##### `node`<sup>Required</sup> <a name="node" id="@alma-cdk/project.SmartStack.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `account`<sup>Required</sup> <a name="account" id="@alma-cdk/project.SmartStack.property.account"></a>

```typescript
public readonly account: string;
```

- *Type:* string

The AWS account into which this stack will be deployed.

This value is resolved according to the following rules:

1. The value provided to `env.account` when the stack is defined. This can
    either be a concerete account (e.g. `585695031111`) or the
    `Aws.accountId` token.
3. `Aws.accountId`, which represents the CloudFormation intrinsic reference
    `{ "Ref": "AWS::AccountId" }` encoded as a string token.

Preferably, you should use the return value as an opaque string and not
attempt to parse it to implement your logic. If you do, you must first
check that it is a concerete value an not an unresolved token. If this
value is an unresolved token (`Token.isUnresolved(stack.account)` returns
`true`), this implies that the user wishes that this stack will synthesize
into a **account-agnostic template**. In this case, your code should either
fail (throw an error, emit a synth error using `Annotations.of(construct).addError()`) or
implement some other region-agnostic behavior.

---

##### `artifactId`<sup>Required</sup> <a name="artifactId" id="@alma-cdk/project.SmartStack.property.artifactId"></a>

```typescript
public readonly artifactId: string;
```

- *Type:* string

The ID of the cloud assembly artifact for this stack.

---

##### `availabilityZones`<sup>Required</sup> <a name="availabilityZones" id="@alma-cdk/project.SmartStack.property.availabilityZones"></a>

```typescript
public readonly availabilityZones: string[];
```

- *Type:* string[]

Returns the list of AZs that are available in the AWS environment (account/region) associated with this stack.

If the stack is environment-agnostic (either account and/or region are
tokens), this property will return an array with 2 tokens that will resolve
at deploy-time to the first two availability zones returned from CloudFormation's
`Fn::GetAZs` intrinsic function.

If they are not available in the context, returns a set of dummy values and
reports them as missing, and let the CLI resolve them by calling EC2
`DescribeAvailabilityZones` on the target environment.

To specify a different strategy for selecting availability zones override this method.

---

##### `bundlingRequired`<sup>Required</sup> <a name="bundlingRequired" id="@alma-cdk/project.SmartStack.property.bundlingRequired"></a>

```typescript
public readonly bundlingRequired: boolean;
```

- *Type:* boolean

Indicates whether the stack requires bundling or not.

---

##### `dependencies`<sup>Required</sup> <a name="dependencies" id="@alma-cdk/project.SmartStack.property.dependencies"></a>

```typescript
public readonly dependencies: Stack[];
```

- *Type:* aws-cdk-lib.Stack[]

Return the stacks this stack depends on.

---

##### `environment`<sup>Required</sup> <a name="environment" id="@alma-cdk/project.SmartStack.property.environment"></a>

```typescript
public readonly environment: string;
```

- *Type:* string

The environment coordinates in which this stack is deployed.

In the form
`aws://account/region`. Use `stack.account` and `stack.region` to obtain
the specific values, no need to parse.

You can use this value to determine if two stacks are targeting the same
environment.

If either `stack.account` or `stack.region` are not concrete values (e.g.
`Aws.account` or `Aws.region`) the special strings `unknown-account` and/or
`unknown-region` will be used respectively to indicate this stack is
region/account-agnostic.

---

##### `nested`<sup>Required</sup> <a name="nested" id="@alma-cdk/project.SmartStack.property.nested"></a>

```typescript
public readonly nested: boolean;
```

- *Type:* boolean

Indicates if this is a nested stack, in which case `parentStack` will include a reference to it's parent.

---

##### `notificationArns`<sup>Required</sup> <a name="notificationArns" id="@alma-cdk/project.SmartStack.property.notificationArns"></a>

```typescript
public readonly notificationArns: string[];
```

- *Type:* string[]

Returns the list of notification Amazon Resource Names (ARNs) for the current stack.

---

##### `partition`<sup>Required</sup> <a name="partition" id="@alma-cdk/project.SmartStack.property.partition"></a>

```typescript
public readonly partition: string;
```

- *Type:* string

The partition in which this stack is defined.

---

##### `region`<sup>Required</sup> <a name="region" id="@alma-cdk/project.SmartStack.property.region"></a>

```typescript
public readonly region: string;
```

- *Type:* string

The AWS region into which this stack will be deployed (e.g. `us-west-2`).

This value is resolved according to the following rules:

1. The value provided to `env.region` when the stack is defined. This can
    either be a concerete region (e.g. `us-west-2`) or the `Aws.region`
    token.
3. `Aws.region`, which is represents the CloudFormation intrinsic reference
    `{ "Ref": "AWS::Region" }` encoded as a string token.

Preferably, you should use the return value as an opaque string and not
attempt to parse it to implement your logic. If you do, you must first
check that it is a concerete value an not an unresolved token. If this
value is an unresolved token (`Token.isUnresolved(stack.region)` returns
`true`), this implies that the user wishes that this stack will synthesize
into a **region-agnostic template**. In this case, your code should either
fail (throw an error, emit a synth error using `Annotations.of(construct).addError()`) or
implement some other region-agnostic behavior.

---

##### `stackId`<sup>Required</sup> <a name="stackId" id="@alma-cdk/project.SmartStack.property.stackId"></a>

```typescript
public readonly stackId: string;
```

- *Type:* string

The ID of the stack.

---

*Example*

```typescript
// After resolving, looks like
'arn:aws:cloudformation:us-west-2:123456789012:stack/teststack/51af3dc0-da77-11e4-872e-1234567db123'
```


##### `stackName`<sup>Required</sup> <a name="stackName" id="@alma-cdk/project.SmartStack.property.stackName"></a>

```typescript
public readonly stackName: string;
```

- *Type:* string

The concrete CloudFormation physical stack name.

This is either the name defined explicitly in the `stackName` prop or
allocated based on the stack's location in the construct tree. Stacks that
are directly defined under the app use their construct `id` as their stack
name. Stacks that are defined deeper within the tree will use a hashed naming
scheme based on the construct path to ensure uniqueness.

If you wish to obtain the deploy-time AWS::StackName intrinsic,
you can use `Aws.stackName` directly.

---

##### `synthesizer`<sup>Required</sup> <a name="synthesizer" id="@alma-cdk/project.SmartStack.property.synthesizer"></a>

```typescript
public readonly synthesizer: IStackSynthesizer;
```

- *Type:* aws-cdk-lib.IStackSynthesizer

Synthesis method for this stack.

---

##### `tags`<sup>Required</sup> <a name="tags" id="@alma-cdk/project.SmartStack.property.tags"></a>

```typescript
public readonly tags: TagManager;
```

- *Type:* aws-cdk-lib.TagManager

Tags to be applied to the stack.

---

##### `templateFile`<sup>Required</sup> <a name="templateFile" id="@alma-cdk/project.SmartStack.property.templateFile"></a>

```typescript
public readonly templateFile: string;
```

- *Type:* string

The name of the CloudFormation template file emitted to the output directory during synthesis.

Example value: `MyStack.template.json`

---

##### `templateOptions`<sup>Required</sup> <a name="templateOptions" id="@alma-cdk/project.SmartStack.property.templateOptions"></a>

```typescript
public readonly templateOptions: ITemplateOptions;
```

- *Type:* aws-cdk-lib.ITemplateOptions

Options for CloudFormation template (like version, transform, description).

---

##### `urlSuffix`<sup>Required</sup> <a name="urlSuffix" id="@alma-cdk/project.SmartStack.property.urlSuffix"></a>

```typescript
public readonly urlSuffix: string;
```

- *Type:* string

The Amazon domain suffix for the region in which this stack is defined.

---

##### `nestedStackParent`<sup>Optional</sup> <a name="nestedStackParent" id="@alma-cdk/project.SmartStack.property.nestedStackParent"></a>

```typescript
public readonly nestedStackParent: Stack;
```

- *Type:* aws-cdk-lib.Stack

If this is a nested stack, returns it's parent stack.

---

##### `nestedStackResource`<sup>Optional</sup> <a name="nestedStackResource" id="@alma-cdk/project.SmartStack.property.nestedStackResource"></a>

```typescript
public readonly nestedStackResource: CfnResource;
```

- *Type:* aws-cdk-lib.CfnResource

If this is a nested stack, this represents its `AWS::CloudFormation::Stack` resource.

`undefined` for top-level (non-nested) stacks.

---

##### `terminationProtection`<sup>Optional</sup> <a name="terminationProtection" id="@alma-cdk/project.SmartStack.property.terminationProtection"></a>

```typescript
public readonly terminationProtection: boolean;
```

- *Type:* boolean

Whether termination protection is enabled for this stack.

---


## Structs <a name="Structs" id="Structs"></a>

### Account <a name="Account" id="@alma-cdk/project.Account"></a>

AWS account configuration.

#### Initializer <a name="Initializer" id="@alma-cdk/project.Account.Initializer"></a>

```typescript
import { Account } from '@alma-cdk/project'

const account: Account = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@alma-cdk/project.Account.property.id">id</a></code> | <code>string</code> | AWS Account ID. |
| <code><a href="#@alma-cdk/project.Account.property.config">config</a></code> | <code>{[ key: string ]: any}</code> | AWS account specific configuration. |
| <code><a href="#@alma-cdk/project.Account.property.environments">environments</a></code> | <code>string[]</code> | List of accepted environments for the given account. |

---

##### `id`<sup>Required</sup> <a name="id" id="@alma-cdk/project.Account.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

AWS Account ID.

---

*Example*

```typescript
'123456789012'
```


##### `config`<sup>Optional</sup> <a name="config" id="@alma-cdk/project.Account.property.config"></a>

```typescript
public readonly config: {[ key: string ]: any};
```

- *Type:* {[ key: string ]: any}

AWS account specific configuration.

For example VPC IDs (for existing VPCs), Direct Connect Gateway IDs, apex domain names (for Route53 Zone lookups), etc. Basically configuration for resources that are defined outside of this CDK application.

---

*Example*

```typescript
{
  dev: {
    id: '111111111111',
    config: {
      baseDomain: 'example.net',
    },
  },
  prod: {
    id: '222222222222',
    config: {
      baseDomain: 'example.com',
    },
  },
},
```


##### `environments`<sup>Optional</sup> <a name="environments" id="@alma-cdk/project.Account.property.environments"></a>

```typescript
public readonly environments: string[];
```

- *Type:* string[]

List of accepted environments for the given account.

List of strings or strings representing regexp initialization (passed onto `new Regexp("^"+environment+"$", "i")`).

---

*Example*

```typescript
["development", "feature/.*"]
```


### Author <a name="Author" id="@alma-cdk/project.Author"></a>

Author information.

I.e. who owns/develops this project/service.

#### Initializer <a name="Initializer" id="@alma-cdk/project.Author.Initializer"></a>

```typescript
import { Author } from '@alma-cdk/project'

const author: Author = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@alma-cdk/project.Author.property.name">name</a></code> | <code>string</code> | Human-readable name for the team/contact responsible for this project/service. |
| <code><a href="#@alma-cdk/project.Author.property.email">email</a></code> | <code>string</code> | Email address for the team/contact responsible for this project/service. |
| <code><a href="#@alma-cdk/project.Author.property.organization">organization</a></code> | <code>string</code> | Human-readable name for the organization responsible for this project/service. |

---

##### `name`<sup>Required</sup> <a name="name" id="@alma-cdk/project.Author.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Human-readable name for the team/contact responsible for this project/service.

---

*Example*

```typescript
'Mad Scientists'
```


##### `email`<sup>Optional</sup> <a name="email" id="@alma-cdk/project.Author.property.email"></a>

```typescript
public readonly email: string;
```

- *Type:* string

Email address for the team/contact responsible for this project/service.

---

*Example*

```typescript
'mad.scientists@acme.example.com'
```


##### `organization`<sup>Optional</sup> <a name="organization" id="@alma-cdk/project.Author.property.organization"></a>

```typescript
public readonly organization: string;
```

- *Type:* string

Human-readable name for the organization responsible for this project/service.

---

*Example*

```typescript
'Acme Corp'
```


### NameProps <a name="NameProps" id="@alma-cdk/project.NameProps"></a>

#### Initializer <a name="Initializer" id="@alma-cdk/project.NameProps.Initializer"></a>

```typescript
import { NameProps } from '@alma-cdk/project'

const nameProps: NameProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@alma-cdk/project.NameProps.property.maxLength">maxLength</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@alma-cdk/project.NameProps.property.trim">trim</a></code> | <code>boolean</code> | *No description.* |

---

##### `maxLength`<sup>Optional</sup> <a name="maxLength" id="@alma-cdk/project.NameProps.property.maxLength"></a>

```typescript
public readonly maxLength: number;
```

- *Type:* number

---

##### `trim`<sup>Optional</sup> <a name="trim" id="@alma-cdk/project.NameProps.property.trim"></a>

```typescript
public readonly trim: boolean;
```

- *Type:* boolean

---

### ProjectConfiguration <a name="ProjectConfiguration" id="@alma-cdk/project.ProjectConfiguration"></a>

#### Initializer <a name="Initializer" id="@alma-cdk/project.ProjectConfiguration.Initializer"></a>

```typescript
import { ProjectConfiguration } from '@alma-cdk/project'

const projectConfiguration: ProjectConfiguration = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@alma-cdk/project.ProjectConfiguration.property.accounts">accounts</a></code> | <code>{[ key: string ]: <a href="#@alma-cdk/project.Account">Account</a>}</code> | Dictionary of AWS account specific configuration. |
| <code><a href="#@alma-cdk/project.ProjectConfiguration.property.author">author</a></code> | <code><a href="#@alma-cdk/project.Author">Author</a></code> | Author information. |
| <code><a href="#@alma-cdk/project.ProjectConfiguration.property.name">name</a></code> | <code>string</code> | Name of your project/service. |
| <code><a href="#@alma-cdk/project.ProjectConfiguration.property.defaultRegion">defaultRegion</a></code> | <code>string</code> | Specify default region you wish to use. |

---

##### `accounts`<sup>Required</sup> <a name="accounts" id="@alma-cdk/project.ProjectConfiguration.property.accounts"></a>

```typescript
public readonly accounts: {[ key: string ]: Account};
```

- *Type:* {[ key: string ]: <a href="#@alma-cdk/project.Account">Account</a>}

Dictionary of AWS account specific configuration.

The key value can be anything (such as AWS Account alias), but it's recommended to keep it short such as `dev` or `prod`.

---

*Example*

```typescript
accounts: {
  dev: {
    id: '111111111111',
    config: {
      baseDomain: 'example.net',
    },
  },
  prod: {
    id: '222222222222',
    config: {
      baseDomain: 'example.com',
    },
  },
},
```


##### `author`<sup>Required</sup> <a name="author" id="@alma-cdk/project.ProjectConfiguration.property.author"></a>

```typescript
public readonly author: Author;
```

- *Type:* <a href="#@alma-cdk/project.Author">Author</a>

Author information.

I.e. who owns/develops this project/service.

---

##### `name`<sup>Required</sup> <a name="name" id="@alma-cdk/project.ProjectConfiguration.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

Name of your project/service.

Prefer `hyphen-case`.

---

*Example*

```typescript
'my-cool-project'
```


##### `defaultRegion`<sup>Optional</sup> <a name="defaultRegion" id="@alma-cdk/project.ProjectConfiguration.property.defaultRegion"></a>

```typescript
public readonly defaultRegion: string;
```

- *Type:* string

Specify default region you wish to use.

If left empty will default to one of the following in order:
1. `$CDK_DEFAULT_REGION`
2. `$AWS_REGION`
3. 'us-east-1'

---

## Classes <a name="Classes" id="Classes"></a>

### AccountType <a name="AccountType" id="@alma-cdk/project.AccountType"></a>

Internal class to handle set/get operations for Account Type.

#### Initializers <a name="Initializers" id="@alma-cdk/project.AccountType.Initializer"></a>

```typescript
import { AccountType } from '@alma-cdk/project'

new AccountType()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@alma-cdk/project.AccountType.get">get</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.AccountType.matchFromEnvironment">matchFromEnvironment</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.AccountType.set">set</a></code> | *No description.* |

---

##### `get` <a name="get" id="@alma-cdk/project.AccountType.get"></a>

```typescript
import { AccountType } from '@alma-cdk/project'

AccountType.get(scope: Construct)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.AccountType.get.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `matchFromEnvironment` <a name="matchFromEnvironment" id="@alma-cdk/project.AccountType.matchFromEnvironment"></a>

```typescript
import { AccountType } from '@alma-cdk/project'

AccountType.matchFromEnvironment(scope: Construct, accounts: {[ key: string ]: Account}, environmentType: string)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.AccountType.matchFromEnvironment.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `accounts`<sup>Required</sup> <a name="accounts" id="@alma-cdk/project.AccountType.matchFromEnvironment.parameter.accounts"></a>

- *Type:* {[ key: string ]: <a href="#@alma-cdk/project.Account">Account</a>}

---

###### `environmentType`<sup>Required</sup> <a name="environmentType" id="@alma-cdk/project.AccountType.matchFromEnvironment.parameter.environmentType"></a>

- *Type:* string

---

##### `set` <a name="set" id="@alma-cdk/project.AccountType.set"></a>

```typescript
import { AccountType } from '@alma-cdk/project'

AccountType.set(scope: Construct, accountType: string)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.AccountType.set.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `accountType`<sup>Required</sup> <a name="accountType" id="@alma-cdk/project.AccountType.set.parameter.accountType"></a>

- *Type:* string

---



### EnvironmentType <a name="EnvironmentType" id="@alma-cdk/project.EnvironmentType"></a>

Internal class to handle set/get operations for Environment Type.

#### Initializers <a name="Initializers" id="@alma-cdk/project.EnvironmentType.Initializer"></a>

```typescript
import { EnvironmentType } from '@alma-cdk/project'

new EnvironmentType()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@alma-cdk/project.EnvironmentType.get">get</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.EnvironmentType.set">set</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.EnvironmentType.tryGet">tryGet</a></code> | *No description.* |

---

##### `get` <a name="get" id="@alma-cdk/project.EnvironmentType.get"></a>

```typescript
import { EnvironmentType } from '@alma-cdk/project'

EnvironmentType.get(scope: Construct, allowedEnvironments: string[])
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.EnvironmentType.get.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `allowedEnvironments`<sup>Required</sup> <a name="allowedEnvironments" id="@alma-cdk/project.EnvironmentType.get.parameter.allowedEnvironments"></a>

- *Type:* string[]

---

##### `set` <a name="set" id="@alma-cdk/project.EnvironmentType.set"></a>

```typescript
import { EnvironmentType } from '@alma-cdk/project'

EnvironmentType.set(scope: Construct, environmentType: string)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.EnvironmentType.set.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `environmentType`<sup>Required</sup> <a name="environmentType" id="@alma-cdk/project.EnvironmentType.set.parameter.environmentType"></a>

- *Type:* string

---

##### `tryGet` <a name="tryGet" id="@alma-cdk/project.EnvironmentType.tryGet"></a>

```typescript
import { EnvironmentType } from '@alma-cdk/project'

EnvironmentType.tryGet(scope: Construct)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.EnvironmentType.tryGet.parameter.scope"></a>

- *Type:* constructs.Construct

---



### EnvRegExp <a name="EnvRegExp" id="@alma-cdk/project.EnvRegExp"></a>

#### Initializers <a name="Initializers" id="@alma-cdk/project.EnvRegExp.Initializer"></a>

```typescript
import { EnvRegExp } from '@alma-cdk/project'

new EnvRegExp(base: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@alma-cdk/project.EnvRegExp.Initializer.parameter.base">base</a></code> | <code>string</code> | *No description.* |

---

##### `base`<sup>Required</sup> <a name="base" id="@alma-cdk/project.EnvRegExp.Initializer.parameter.base"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@alma-cdk/project.EnvRegExp.test">test</a></code> | *No description.* |

---

##### `test` <a name="test" id="@alma-cdk/project.EnvRegExp.test"></a>

```typescript
public test(value: string): boolean
```

###### `value`<sup>Required</sup> <a name="value" id="@alma-cdk/project.EnvRegExp.test.parameter.value"></a>

- *Type:* string

---




### Name <a name="Name" id="@alma-cdk/project.Name"></a>

#### Initializers <a name="Initializers" id="@alma-cdk/project.Name.Initializer"></a>

```typescript
import { Name } from '@alma-cdk/project'

new Name()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@alma-cdk/project.Name.globally">globally</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.Name.it">it</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.Name.withProject">withProject</a></code> | *No description.* |

---

##### `globally` <a name="globally" id="@alma-cdk/project.Name.globally"></a>

```typescript
import { Name } from '@alma-cdk/project'

Name.globally(scope: Construct, baseName: string, props?: NameProps)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.Name.globally.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `baseName`<sup>Required</sup> <a name="baseName" id="@alma-cdk/project.Name.globally.parameter.baseName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@alma-cdk/project.Name.globally.parameter.props"></a>

- *Type:* <a href="#@alma-cdk/project.NameProps">NameProps</a>

---

##### `it` <a name="it" id="@alma-cdk/project.Name.it"></a>

```typescript
import { Name } from '@alma-cdk/project'

Name.it(scope: Construct, baseName: string, props?: NameProps)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.Name.it.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `baseName`<sup>Required</sup> <a name="baseName" id="@alma-cdk/project.Name.it.parameter.baseName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@alma-cdk/project.Name.it.parameter.props"></a>

- *Type:* <a href="#@alma-cdk/project.NameProps">NameProps</a>

---

##### `withProject` <a name="withProject" id="@alma-cdk/project.Name.withProject"></a>

```typescript
import { Name } from '@alma-cdk/project'

Name.withProject(scope: Construct, baseName: string, props?: NameProps)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.Name.withProject.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `baseName`<sup>Required</sup> <a name="baseName" id="@alma-cdk/project.Name.withProject.parameter.baseName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@alma-cdk/project.Name.withProject.parameter.props"></a>

- *Type:* <a href="#@alma-cdk/project.NameProps">NameProps</a>

---



### PathName <a name="PathName" id="@alma-cdk/project.PathName"></a>

#### Initializers <a name="Initializers" id="@alma-cdk/project.PathName.Initializer"></a>

```typescript
import { PathName } from '@alma-cdk/project'

new PathName()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@alma-cdk/project.PathName.globally">globally</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.PathName.it">it</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.PathName.withProject">withProject</a></code> | *No description.* |

---

##### `globally` <a name="globally" id="@alma-cdk/project.PathName.globally"></a>

```typescript
import { PathName } from '@alma-cdk/project'

PathName.globally(scope: Construct, baseName: string, props?: NameProps)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.PathName.globally.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `baseName`<sup>Required</sup> <a name="baseName" id="@alma-cdk/project.PathName.globally.parameter.baseName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@alma-cdk/project.PathName.globally.parameter.props"></a>

- *Type:* <a href="#@alma-cdk/project.NameProps">NameProps</a>

---

##### `it` <a name="it" id="@alma-cdk/project.PathName.it"></a>

```typescript
import { PathName } from '@alma-cdk/project'

PathName.it(scope: Construct, baseName: string, props?: NameProps)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.PathName.it.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `baseName`<sup>Required</sup> <a name="baseName" id="@alma-cdk/project.PathName.it.parameter.baseName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@alma-cdk/project.PathName.it.parameter.props"></a>

- *Type:* <a href="#@alma-cdk/project.NameProps">NameProps</a>

---

##### `withProject` <a name="withProject" id="@alma-cdk/project.PathName.withProject"></a>

```typescript
import { PathName } from '@alma-cdk/project'

PathName.withProject(scope: Construct, baseName: string, props?: NameProps)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.PathName.withProject.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `baseName`<sup>Required</sup> <a name="baseName" id="@alma-cdk/project.PathName.withProject.parameter.baseName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@alma-cdk/project.PathName.withProject.parameter.props"></a>

- *Type:* <a href="#@alma-cdk/project.NameProps">NameProps</a>

---



### ProjectContext <a name="ProjectContext" id="@alma-cdk/project.ProjectContext"></a>

#### Initializers <a name="Initializers" id="@alma-cdk/project.ProjectContext.Initializer"></a>

```typescript
import { ProjectContext } from '@alma-cdk/project'

new ProjectContext()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@alma-cdk/project.ProjectContext.getAccountConfig">getAccountConfig</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.ProjectContext.getAccountId">getAccountId</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.ProjectContext.getAccountType">getAccountType</a></code> | Returns the account type given in runtime/CLI context. |
| <code><a href="#@alma-cdk/project.ProjectContext.getAllowedEnvironments">getAllowedEnvironments</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.ProjectContext.getAuthorEmail">getAuthorEmail</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.ProjectContext.getAuthorName">getAuthorName</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.ProjectContext.getAuthorOrganization">getAuthorOrganization</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.ProjectContext.getDefaultRegion">getDefaultRegion</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.ProjectContext.getEnvironment">getEnvironment</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.ProjectContext.getName">getName</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.ProjectContext.tryGetEnvironment">tryGetEnvironment</a></code> | *No description.* |

---

##### `getAccountConfig` <a name="getAccountConfig" id="@alma-cdk/project.ProjectContext.getAccountConfig"></a>

```typescript
import { ProjectContext } from '@alma-cdk/project'

ProjectContext.getAccountConfig(scope: Construct, key: string, defaultValue?: any)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.ProjectContext.getAccountConfig.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `key`<sup>Required</sup> <a name="key" id="@alma-cdk/project.ProjectContext.getAccountConfig.parameter.key"></a>

- *Type:* string

---

###### `defaultValue`<sup>Optional</sup> <a name="defaultValue" id="@alma-cdk/project.ProjectContext.getAccountConfig.parameter.defaultValue"></a>

- *Type:* any

---

##### `getAccountId` <a name="getAccountId" id="@alma-cdk/project.ProjectContext.getAccountId"></a>

```typescript
import { ProjectContext } from '@alma-cdk/project'

ProjectContext.getAccountId(scope: Construct)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.ProjectContext.getAccountId.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `getAccountType` <a name="getAccountType" id="@alma-cdk/project.ProjectContext.getAccountType"></a>

```typescript
import { ProjectContext } from '@alma-cdk/project'

ProjectContext.getAccountType(scope: Construct)
```

Returns the account type given in runtime/CLI context.

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.ProjectContext.getAccountType.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `getAllowedEnvironments` <a name="getAllowedEnvironments" id="@alma-cdk/project.ProjectContext.getAllowedEnvironments"></a>

```typescript
import { ProjectContext } from '@alma-cdk/project'

ProjectContext.getAllowedEnvironments(scope: Construct)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.ProjectContext.getAllowedEnvironments.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `getAuthorEmail` <a name="getAuthorEmail" id="@alma-cdk/project.ProjectContext.getAuthorEmail"></a>

```typescript
import { ProjectContext } from '@alma-cdk/project'

ProjectContext.getAuthorEmail(scope: Construct)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.ProjectContext.getAuthorEmail.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `getAuthorName` <a name="getAuthorName" id="@alma-cdk/project.ProjectContext.getAuthorName"></a>

```typescript
import { ProjectContext } from '@alma-cdk/project'

ProjectContext.getAuthorName(scope: Construct)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.ProjectContext.getAuthorName.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `getAuthorOrganization` <a name="getAuthorOrganization" id="@alma-cdk/project.ProjectContext.getAuthorOrganization"></a>

```typescript
import { ProjectContext } from '@alma-cdk/project'

ProjectContext.getAuthorOrganization(scope: Construct)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.ProjectContext.getAuthorOrganization.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `getDefaultRegion` <a name="getDefaultRegion" id="@alma-cdk/project.ProjectContext.getDefaultRegion"></a>

```typescript
import { ProjectContext } from '@alma-cdk/project'

ProjectContext.getDefaultRegion(scope: Construct)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.ProjectContext.getDefaultRegion.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `getEnvironment` <a name="getEnvironment" id="@alma-cdk/project.ProjectContext.getEnvironment"></a>

```typescript
import { ProjectContext } from '@alma-cdk/project'

ProjectContext.getEnvironment(scope: Construct)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.ProjectContext.getEnvironment.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `getName` <a name="getName" id="@alma-cdk/project.ProjectContext.getName"></a>

```typescript
import { ProjectContext } from '@alma-cdk/project'

ProjectContext.getName(scope: Construct)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.ProjectContext.getName.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `tryGetEnvironment` <a name="tryGetEnvironment" id="@alma-cdk/project.ProjectContext.tryGetEnvironment"></a>

```typescript
import { ProjectContext } from '@alma-cdk/project'

ProjectContext.tryGetEnvironment(scope: Construct)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.ProjectContext.tryGetEnvironment.parameter.scope"></a>

- *Type:* constructs.Construct

---



### UrlName <a name="UrlName" id="@alma-cdk/project.UrlName"></a>

#### Initializers <a name="Initializers" id="@alma-cdk/project.UrlName.Initializer"></a>

```typescript
import { UrlName } from '@alma-cdk/project'

new UrlName()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@alma-cdk/project.UrlName.globally">globally</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.UrlName.it">it</a></code> | *No description.* |
| <code><a href="#@alma-cdk/project.UrlName.withProject">withProject</a></code> | *No description.* |

---

##### `globally` <a name="globally" id="@alma-cdk/project.UrlName.globally"></a>

```typescript
import { UrlName } from '@alma-cdk/project'

UrlName.globally(scope: Construct, baseName: string, props?: NameProps)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.UrlName.globally.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `baseName`<sup>Required</sup> <a name="baseName" id="@alma-cdk/project.UrlName.globally.parameter.baseName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@alma-cdk/project.UrlName.globally.parameter.props"></a>

- *Type:* <a href="#@alma-cdk/project.NameProps">NameProps</a>

---

##### `it` <a name="it" id="@alma-cdk/project.UrlName.it"></a>

```typescript
import { UrlName } from '@alma-cdk/project'

UrlName.it(scope: Construct, baseName: string, props?: NameProps)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.UrlName.it.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `baseName`<sup>Required</sup> <a name="baseName" id="@alma-cdk/project.UrlName.it.parameter.baseName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@alma-cdk/project.UrlName.it.parameter.props"></a>

- *Type:* <a href="#@alma-cdk/project.NameProps">NameProps</a>

---

##### `withProject` <a name="withProject" id="@alma-cdk/project.UrlName.withProject"></a>

```typescript
import { UrlName } from '@alma-cdk/project'

UrlName.withProject(scope: Construct, baseName: string, props?: NameProps)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@alma-cdk/project.UrlName.withProject.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `baseName`<sup>Required</sup> <a name="baseName" id="@alma-cdk/project.UrlName.withProject.parameter.baseName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@alma-cdk/project.UrlName.withProject.parameter.props"></a>

- *Type:* <a href="#@alma-cdk/project.NameProps">NameProps</a>

---




