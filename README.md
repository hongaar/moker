# moker [![npm](https://img.shields.io/npm/v/moker)](https://www.npmjs.com/package/moker)

**No more struggles setting up a new JavaScript repository. Kick-start
single-purpose repos, monorepos, monorepo workspaces and common tooling:**

```bash
# initialize a monorepo
yarn dlx moker create --monorepo my-monorepo
cd my-monorepo

# install common tools
yarn moker use prettier doctoc semantic-release

# create workspaces
yarn moker add server --template express
yarn moker add client --template cra
yarn moker add shared --template lib
yarn moker add cli --template bandersnatch
```

## Features

- 👢 Kick-start a new repo or monorepo using Yarn
- 🧰 Plugins to use pre-configured common tooling
- ➕ Quickly add workspaces to a monorepo
- 🧬 Workspace templates for a shared library, React app, API or CLI
- ⚡ Extensible, bring your own plugins

> 🤓 _Default_: The core plugins make some assumptions you may not agree with.
> If that's the case, this tool is probably not for you. The defaults used are
> documented below and marked with a nerd-face emoji so you should be able to
> get a clear picture of what to expect.

## Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Usage](#usage)
  - [Creating a single-purpose repo](#creating-a-single-purpose-repo)
  - [Creating a monorepo](#creating-a-monorepo)
  - [Creating a monorepo workspace](#creating-a-monorepo-workspace)
  - [Using plugins](#using-plugins)
  - [Using templates](#using-templates)
  - [Using plugins and templates together](#using-plugins-and-templates-together)
- [Available plugins](#available-plugins)
  - [`dependabot`](#dependabot)
  - [`devcontainer`](#devcontainer)
  - [`doctoc`](#doctoc)
  - [`esbuild`](#esbuild)
  - [`github-actions`](#github-actions)
  - [`husky`](#husky)
  - [`jest`](#jest)
  - [`lint-staged`](#lint-staged)
  - [`prettier`](#prettier)
  - [`semantic-release`](#semantic-release)
  - [`test`](#test)
  - [`todos`](#todos)
  - [`typescript`](#typescript)
  - [`xv`](#xv)
- [Available templates](#available-templates)
  - [`bandersnatch`](#bandersnatch)
  - [`common`](#common)
  - [`cra`](#cra)
  - [`express`](#express)
  - [`github-action`](#github-action)
  - [`lib`](#lib)
- [Commands](#commands)
- [Contributing](#contributing)
  - [Roadmap](#roadmap)
  - [Development](#development)
  - [Devcontainer](#devcontainer)
  - [Credits](#credits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Getting started

## Prerequisites

You will need Node v14+ and Yarn v2+ in order to use `moker`.

- Install Node with [nvm](https://github.com/nvm-sh/nvm#install--update-script)
  or using [nodesource](https://github.com/nodesource/distributions#debinstall).
- Install Yarn using these simple steps:
  ```bash
  corepack enable
  corepack prepare yarn@stable --activate
  ```

## Usage

`moker` is distributed as a NPM package, and can be run with `yarn dlx`:

```bash
yarn dlx moker <command>
```

> **Note**: Note that when we use `yarn dlx moker` to create a new repo, `moker`
> is added as a dependency to your new repo, so we can simply use `yarn moker`
> to execute commands from within the repo directory.

## Creating a single-purpose repo

To create a new repo in the `my-repo` directory:

```bash
yarn dlx moker create my-repo
```

## Creating a monorepo

To create a new monorepo in the `my-monorepo` directory: :

```bash
yarn dlx moker create --monorepo my-monorepo
```

> 🤓 _Default_: The monorepo is initiated with Yarn without Zero-Installs and in
> legacy `nodeLinker: node-modules` mode because a lot of packages are not yet
> compatible with PnP or require a workaround.

## Creating a monorepo workspace

Workspaces (a.k.a. monorepo packages) are added in a customizable subdirectory
of the monorepo (the default is `packages`). To add a new workspace called
`my-workspace` to your monorepo, run this from within the monorepo directory:

```bash
yarn moker add my-workspace
```

## Using plugins

Plugins are used to add additional tools to your repo or workspace. Add the
`prettier` plugin with:

```bash
yarn moker use prettier
```

Plugins may work together. For example, `lint-staged` will install a pre-commit
hook which formats code if `prettier` and `husky` are installed. The order in
which plugins are added does not matter. You can install multiple plugins at
once:

```bash
yarn moker use prettier lint-staged husky
```

> **Note**: Some plugins only work at the repo or workspace level, `moker` will
> warn you if you try to add a plugin at the wrong level.

For a complete list of out-of-the-box plugins, see the section
[available plugins](#available-plugins). Using 3rd party plugins is also
supported:

```bash
yarn add --dev --exact moker-plugin-name
yarn moker use moker-plugin-name
```

## Using templates

Templates are pre-defined collections of plugins and scaffolding to quickly
create focussed new repos or workspaces. To create a new repo `my-repo` with the
`common` template:

```bash
yarn dlx moker create --template common my-repo
```

To add a workspace called `shared` to a monorepo using the `lib` template:

```bash
yarn moker add --template lib shared
```

You can install multiple templates at once:

```bash
yarn dlx moker create --template common --template github-action my-action
```

For a complete list of out-of-the-box templates, see the section
[available templates](#available-templates). Using 3rd party templates is also
supported:

```bash
yarn dlx --package moker-template-name \
  moker create --template moker-template-name my-repo

```

## Using plugins and templates together

Plugins and templates can be used together, for example:

```bash
yarn dlx moker create --template express --use prettier my-repo
```

# Available plugins

## `dependabot`

_Scope: repo_

This plugin adds a [Dependabot] configuration to your monorepo with an updater
for NPM packages.

If you have the `github-actions` plugin installed, it will add an updater for
GitHub Actions workflows.

[Dependabot]:
  https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuring-dependabot-version-updates

## `devcontainer`

_Scope: repo_

This plugin creates a [Development Containers](https://containers.dev)
configuration using the
[`typescript-node`](https://hub.docker.com/_/microsoft-vscode-devcontainers)
image.

If you have the `prettier` plugin installed, it will add the [Prettier VS Code
extension].

[Prettier VS Code extension]:
  https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

## `doctoc`

_Scope: repo_

This plugin adds a script to generate a table of contents for the README using
[doctoc](https://github.com/thlorenz/doctoc).

If you have the `husky` plugin installed, it will also add a pre-commit hook.

## `esbuild`

_Scope: repo or workspace_

This plugin sets up [esbuild](https://esbuild.github.io) and adds a `build` and
`build:watch` script to the repo or both the workspace and the monorepo.

> 🤓 _Default_: If you have the `typescript` plugin installed as well, we'll
> assume that you want to build to a bundle instead of transpiled TypeScript. We
> will still use `tsc` for type checking.

## `github-actions`

_Scope: repo_

This plugin creates a simple `ci.yml`
[GitHub Actions](https://github.com/features/actions) workflow.

If you have the `prettier` plugin installed, this will also setup a `lint.yml`
workflow.

If you have the `semantic-release` plugin installed, this will also setup a
`release.yml` workflow. This workflow needs these secrets to be added to your
repository:

- `GH_TOKEN`: a GitHub token with read/write access to your repository
- `NPM_TOKEN`: an NPM token with publish access to your packages

If you have the `dependabot` plugin installed, this will also setup a
`dependabot-automerge` workflow which enables auto-merge (squash) on dependabot
PRs. You need to enable _Allow auto-merge_ in the GitHub repository settings and
apply _Branch protection rules_ for the main branch.

> **Note**: If you enabled _Require approvals_ in the branch protection rules,
> this won't automatically approve the PR. You will need to add an additional
> command to the workflow, like:
>
> ```diff
>  steps:
> -  - run: gh pr merge --auto --squash "$PR_URL"
> +  - run: |
> +      gh pr review --approve "$PR_URL"
> +      gh pr merge --auto --squash "$PR_URL"
>      env:
> ```

> 🤓 _Default_: The workflows will use the `main` branch by default, but it is
> trivial to change this.

## `husky`

_Scope: repo_

This plugin sets up [Husky](https://typicode.github.io/husky/#/) at the repo
level.

> **Warning**: The `postinstall` script to install Husky automatically is only
> installed on (private) monorepos. Otherwise, `postinstall` will run when
> someone installs your package and result in an error.
>
> See
> [Husky docs on installing with Yarn 2](https://typicode.github.io/husky/#/?id=yarn-2)

## `jest`

_Scope: repo or workspace_

> 🧪 _Experimental_ Currently only works with the `typescript` plugin. Currently
> doesn't work when you have ESM dependencies in `node_modules`.

This plugin sets up [Jest](https://jestjs.io) and adds a `test` and `test:watch`
script to the repo or both the workspace and the monorepo.

## `lint-staged`

_Scope: repo_

This plugin sets up [lint-staged](https://github.com/okonet/lint-staged) at the
monorepo level.

If you have the `prettier` plugin installed, this will setup a task to format
staged files using `prettier --write --ignore-unknown`.

If you have the `husky` plugin installed, this will setup a pre-commit hook to
run `yarn lint-staged`.

## `prettier`

_Scope: repo_

This plugin sets up [Prettier](https://prettier.io).

> 🤓 _Default_: Prettier is installed with this configuration:
>
> ```yaml
> proseWrap: always
> ```
>
> We only set this `proseWrap` override because we think markdown files should
> always be truncated to match whatever the `printWidth` setting is. This makes
> it so much easier to read and write markdown files!

## `semantic-release`

_Scope: repo_

This plugin sets up
[semantic-release](https://semantic-release.gitbook.io/semantic-release/). It
uses the
[semantic-release-yarn](https://github.com/hongaar/semantic-release-yarn) plugin
which has support for releasing monorepos.

Please note that by default the root repository is not published. You can change
this by setting the `private` property in `package.json` to `false`.

> 🤓 _Default_: The release configuration will use the `main` branch by default,
> but it is trivial to change this.

## `test`

_Scope: repo or workspace_

This plugin enables testing with the [test](https://www.npmjs.com/package/test)
package, which is a port of the native
[node:test](https://nodejs.org/api/test.html) which is only available in Node
≥ 18. It uses [tap](https://node-tap.org) for formatting the TAP output.

When the `typescript` plugin is also installed, it will use
[ts-node](https://typestrong.org/ts-node/) to load TypeScript test files.

## `todos`

_Scope: repo or workspace_

This plugin adds a script to generate a TODO markdown file from all code
annotations using [leasot](https://github.com/pgilad/leasot).

If you have the `husky` plugin installed, it will also add a pre-commit hook.

## `typescript`

_Scope: repo or workspace_

This plugin sets up [TypeScript](https://www.typescriptlang.org) and adds a
`build` and `build:watch` script to the repo or both the workspace and the
monorepo.

## `xv`

_Scope: repo or workspace_

> 🧪 _Experimental_ Currently only works with the `typescript` plugin.

This plugin sets up [xv](https://github.com/typicode/xv) and adds a `test`
script to the repo or both the workspace and the monorepo.

# Available templates

## `bandersnatch`

_Scope: repo or workspace_

Scaffolds a simple [bandersnatch](https://github.com/hongaar/bandersnatch) CLI
app tool with the [typescript](#typescript-workspace) and
[jest](#jest-workspace) plugins.

## `common`

_Scope: repo_

This is the only monorepo template at this point. It simply installs all
available monorepo plugins.

## `cra`

_Scope: repo or workspace_

Uses [create-react-app](https://create-react-app.dev/) to scaffold a React.js
app (web client).

## `express`

_Scope: repo or workspace_

Scaffolds a simple [express](https://expressjs.com) HTTP app with the
[typescript](#typescript-workspace) and [jest](#jest-workspace) plugins.

## `github-action`

_Scope: repo_

> 🧪 _Experimental_

Scaffolds a [custom GitHub Action] template.

[custom GitHub Action]:
  https://docs.github.com/en/actions/creating-actions/about-custom-actions

## `lib`

_Scope: repo or workspace_

A plain shared library template with the [typescript](#typescript-workspace) and
[jest](#jest-workspace) plugins.

# Commands

See `moker --help` for a list of available commands.

# Contributing

Contributions are very welcome!

## Roadmap

- [ ] Use TS project references for better (incremental) compilation
      [example](https://www.npmjs.com/package/@isomorphic-typescript/ts-monorepo)
- [ ] Support for `swc`/`esbuild`
- [ ] A compat lib (which builds cjs and mjs targets)
- [ ] Blog post / tutorial
- [ ] Docs for writing custom plugins / templates
- [x] Add LICENSE file to repo
- [x] Adapt for non-monorepo use-cases
- [x] github-actions plugin
- [x] devcontainer plugin
- [x] leasot (todos) plugin
- [x] doctoc plugin
- [x] semantic-release plugin
- [x] Port templates
- [x] Support for BYO plugins/templates
- [x] Remove plugins

Also see [TODO.md](TODO.md).

## Development

To run the `moker` CLI from source, run:

```bash
yarn start
```

Note that you can create a new monorepo for testing purposes outside the current
working directory with:

```bash
yarn start create /path/to/my-repo
```

## Devcontainer

A devcontainer configuration is included in this repo to
[get started quickly](https://code.visualstudio.com/docs/remote/containers#_quick-start-open-an-existing-folder-in-a-container).

## Credits

©️ Copyright 2022 [Joram van den Boezem](https://joram.dev)  
♻️ Licensed under the [MIT license](LICENSE)  
🤔 Moker? **MOnorepo KickstartER**
