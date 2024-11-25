# Migration Guide `v0` → `v1`

<br/>

## Upgrade

To upgrade from the experimental `v0` into `v1` stable major, run:

```sh
npm i -D @alma-cdk/project@1
```

> [!Important]
> No other source code changes are required and no CloudFormation diff will be caused by this upgrade, **with the EXCEPTION of how you want to control the [tagging behavior changes](#tagging-behavior-changes)**. Additionally [minimum NodeJS version](#nodejs-version-requirements) is set to `18`.

> [!Tip]
> It's recommended to run `cdk diff` against your existing CDK stacks to verify the effects of the upgrade (instead of blindly deploying).

<br/><br/>

## NodeJS version requirements

Previous `v0` supported any NodeJS version starting from ~~`14.17.6`~~.

As of `v1`, the aim is to support: <sup>(subject to change in new future major versions)</sup>

- any NodeJS version [in maintenance mode until EOL](https://github.com/nodejs/Release?tab=readme-ov-file#release-schedule)
- active LTS version
- current version

At the time of writing this document (2024-11-26), the supported NodeJS version range is the following:

| Minimum  | Recommended     | Maximum      |
| -------- | --------------- | ------------ |
| **`18`** | `22` active LTS | `23` current |

You can see the actual up-to-date supported versions in [`package.json`'s `engines.node` field](https://github.com/alma-cdk/project/blob/main/package.json).

<br/><br/>

## Tagging behavior changes

Due to a bug in `v0`, the `Contact` and `Organization` tags were NOT applied as they were intended; This bug was fixed in `v1` which means that _by default_, upgrading from v0→v1 most likely introduces tagging related CloudFormation diff. Example:

![CloudFormation Diff example when upgrading from v0 to v1](/assets/v0-to-v1-tag-diff.png)

In most cases this is harmless, but to ease the migration process, we provide multiple options how you can control when you want to adopt the "new" tagging behavior (see below).

<br/>

### Opt-out via Feature Flag

Adding the `Contact` and `Organization` tags to all resources should be safe operation ([as we exclude problematic resources](https://github.com/alma-cdk/project/blob/main/src/smartstack/tags/exclude.ts)), but we allow disabling/postponing the "new" tagging behavior via a compatibility feature flag (since `v1.0.1`) in `cdk.json` context:

```diff
{
  "context": {
+   "@alma-cdk/project:compatibilityV0Tags": true,
    // existing context keys
  },
}
```

> [!Important]
> Using this feature flag is meant for easing the transition from v0 to v1 initially. You should still remove the compatibility feature flag and deploy using the "new" tagging behavior rather sooner than later, as the **compatibility feature flag will be removed in future v2 major version** and the "new" tagging behavior will become default.

<br/>

### Acknowledging the warning

Using this compatibility feature flag will output warnings during synthesis. For example:

![Warning output from CDK CLI when compatibility flag used](/assets/v0-to-v1-compat-feature-flag-warning.png)

You can safely ignore these warnings until you decide to adopt into the "new" tagging behavior, but if you want to get rid of the warning message (or you run AWS CDK CLI with `--strict` flag that fails synthesis on warnings), you can acknowledge this warning (since `v1.0.1`) by setting:

```ts
project.acknowledgeWarnings([
  {
    id: "@alma-cdk/project:compatibilityV0Tags",
    message:
      "Temporarily disable warnings about the use of compatibility feature flag",
  },
]);
```

… but again, you need to adopt the "new" tagging behavior before future `v2` major version.

<br/>

#### Strict Mode

If you are running AWS CDK CLI with `--strict` flag, the acknowledged warning will cause metadata diff:

![metadata diff on strict mode](/assets/v0-to-v1-metadata-diff-on-strict.png)

<br/>

### Opt-out individual stacks or resources

If you have any specific problematic resources or stacks, you can always opt-out individual constructs (and their children) by using CDK [Tags](https://docs.aws.amazon.com/cdk/v2/guide/tagging.html):

```ts
cdk.Tags.of(scope).remove("Contact");
cdk.Tags.of(scope).remove("Organization");
```

> [!WARNING]
> Please, use these individual Tag removals sparingly and as a last resort. If the need for individual tag removal is caused by an issue/bug with the migration, please let us know via issue (see below).

<br/><br/>

## Migration issues?

File [a new issue](https://github.com/alma-cdk/project/issues/new). Do not disclose any sensitive information (including AWS Account IDs)!

<br/><br/>

## Roadmap

We are drafting a vision/roadmap for upcoming v2 and v3 versions during Dec 2024 – Jan 2025. For now, see [issue #36](https://github.com/alma-cdk/project/issues/36).
