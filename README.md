<div align="center">
	<br/>
	<br/>
  <h1>
	<img width="300" src="assets/alma-cdk-project.svg" alt="Alma CDK Project" />
  <br/>
  <br/>
  </h1>

  ```sh
  npm i -D @alma-cdk/project
  ```

  <div align="left">


  Opinionated CDK Project “Framework” is a set of CDK constructs and utilities aiming to solve many complexities related to configuration, naming, tagging, etc. for multi-account & multi-environment projects that utilize [Continuous Delivery & Deployment](https://continuousdelivery.com/) and [Trunk Based Development](https://trunkbaseddevelopment.com/) with feature branches/environments.

  > Things can get quite complex if you:
  > - **Deploy a CDK project into multiple different AWS Accounts** <br/>following best practises and separating production from other environments
  > - **Manage all the account specific configurations somewhere**<br/>but it's often hard to decide where to store that information and how to access it
  > - **Need to map different environments to specific accounts**<br/>as often you may have more application environments than you have AWS accounts
  > - **Adjust your infrastructure code for specific environments**<br/>for example cost optimization or backups often behave differently for production vs. development
  > - **Potentially use dynamic & short-lived “feature environments”**<br/>e.g. by triggering temporary deployments on Github Pull Requests with a `feature/` branch prefix
  > - **Need to setup well-defined tagging**<br/>as proper tagging helps with cost management and even defining backups
  > - **Repeat the above steps for multiple CDK projects**<br/>because let's say you develop a lot of microservices in different repositories
  >
  > &nbsp;&nbsp;&nbsp;&nbsp;– Ari Palo, Lead Technologist, Alma Media

  </div>
  <br/>
</div>


## Getting Started

Steps required to define a _environmental_ project resources; At first, it might seem complex but once you get into the habbit of defining your projects this way it starts to make sense:

1. Initialize a new `Project` instead of `cdk.App`:

    ```ts
    // bin/app.ts
    import { Project, Accounts } from '@alma-cdk/project';

    const project = new Project({
      // Basic info, you could also read these from package.json if you want
      name: 'my-cool-project',
      author: {
        organization: 'Acme Corp',
        name: 'Mad Scientists',
        email: 'mad.scientists@acme.example.com',
      },

      // If not set, defaults to one of: $CDK_DEFAULT_REGION, $AWS_REGION or us-east-1
      defaultRegion: 'eu-west-1',

      // Configures the project to use 2 AWS accounts (recommended)
      accounts: Accounts.two({
        dev: {
          id: '111111111111',
          config: {
            // whatever you want here as [string]: any
            baseDomain: 'example.net',
          },
        },
        prod: {
          id: '222222222222',
          config: {
            // whatever you want here as [string]: any
            baseDomain: 'example.com',
          },
        },
      }),
    })
    ```

2. Define a stack which `extends SmartStack` with resources:
    ```ts
    // lib/my-stack.ts
    import { Construct } from 'constructs';
    import { StackProps, RemovalPolicy } from 'aws-cdk-lib';
    import { SmartStack, Name, UrlName, PathName, EC } from '@alma-cdk/project';

    export class MyStack extends SmartStack {
      constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new dynamodb.Table(this, 'Table', {
          removalPolicy: EC.isStable(this) ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,

          queueName: Name.it(this, 'MyTable'),
          // StagingMyTable
        });

        new events.EventBus(this, 'EventBus', {
          topicName: Name.withProject(this, 'MyEventBus'),
          // MyCoolProjectStagingMyEventBus
        });

        new s3.Bucket(this, 'Bucket', {

          removalPolicy: EC.isStable(this) ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
          autoDeleteObjects: EC.isStable(this) ? false : true,

          bucketName: UrlName.globally(this, 'MyBucket'),
          // acme-corp-my-cool-project-feature-foo-bar-my-bucket
        });

        new ssm.StringParameter(this, 'Parameter', {
          stringValue: 'Foo',
          tier: ssm.ParameterTier.ADVANCED,
          parameterName: PathName.withProject(this, 'MyNamespace/MyParameter'),
          // /MyCoolProject/Staging/MyNamespace/MyParameter
        });
      }
    }
    ```

3. Define a new _environmental_ which `extends EnvironmentWrapper` and initialize all your environmental `SmartStack` stacks within:

    ```ts
    // lib/environment.ts
    import { EnvironmentWrapper } from '@alma-cdk/project';
    import { MyStack } from './my-stack';

    export class Environment extends EnvironmentWrapper {
      constructor(scope: Construct) {
        new MyStack(this, 'MyStack', { summary: 'This is required' });)
      }
    }
    ```

    Resulting Stack properties (given `environment=staging`):

    |        Property         |                    Example value                     |
    | :---------------------- | :--------------------------------------------------- |
    | `stackName`             | `"MyCoolProject-Environment-Staging-MyExampleStack"` |
    | `terminationProtection` | `true`                                               |
    | `env.account`           | `"111111111111"`                                     |
    | `env.region`            | `"eu-west-1"`                                        |

    Resulting Tags for the Stack and its resources (given `environment=staging`):

    |        Property         |           Example value           |
    | :---------------------- | :-------------------------------- |
    | `Account`               | `dev`                             |
    | `Environment`           | `staging`                         |
    | `Project`               | `my-cool-project`                 |
    | `Author`                | `Mad Scientists`                  |
    | `Organization`          | `Acme Corp`                       |
    | `Contact`               | `mad.scientists@acme.example.com` |

4. Finally initialize the environment with the `Project` scope:

    ```ts
    // bin/app.ts
    import { Project, Accounts } from '@alma-cdk/project';
    import { Environment } from '../lib/environment';

    const project = new Project({/* removed for brevity */})

    new Environment(project);
    ```
