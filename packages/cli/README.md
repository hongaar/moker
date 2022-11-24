# moker

[![npm](https://img.shields.io/npm/v/moker)](https://www.npmjs.com/package/moker)

**No more struggles setting up monorepo tooling. Kick-start monorepos and
workspaces fast:**

```bash
# initialize a monorepo
yarn dlx moker create my-monorepo
cd my-monorepo

# install common tools
yarn moker use prettier husky lint-staged github-actions devcontainer

# create workspaces
yarn moker add --template express server
yarn moker add --template cra client
```

## Features

- 👢 Kick-start a monorepo with ease
- 🧰 Monorepo plugins to use pre-configured common tooling
- ➕ Add workspaces on demand
- 🧬 Workspace templates for a library, React app, API or CLI
- ⚡ Extensible, bring your own plugins

> 🤓 The core plugins make some assumptions you may not agree with. If that's
> the case, this tool is probably not for you. The defaults used are documented
> below and marked with a nerd-face emoji so you should be able to get a clear
> picture of what to expect.

## Table of contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

  - [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Create monorepo](#create-monorepo)
  - [Use plugins](#use-plugins)
  - [Add workspace](#add-workspace)
- [Available plugins](#available-plugins)
  - [`devcontainer` _monorepo_](#devcontainer-_monorepo_)
  - [`github-actions` _monorepo_](#github-actions-_monorepo_)
  - [`husky` _monorepo_](#husky-_monorepo_)
  - [`lint-staged` _monorepo_](#lint-staged-_monorepo_)
  - [`prettier` _monorepo_](#prettier-_monorepo_)
  - [`jest` _workspace_](#jest-_workspace_)
  - [`typescript` _workspace_](#typescript-_workspace_)
- [Available templates](#available-templates)
  - [`common` _monorepo_](#common-_monorepo_)
  - [`bandersnatch` _workspace_](#bandersnatch-_workspace_)
  - [`cra` _workspace_](#cra-_workspace_)
  - [`express` _workspace_](#express-_workspace_)
  - [`lib` _workspace_](#lib-_workspace_)
- [Contributing](#contributing)
  - [Roadmap](#roadmap)
  - [Development](#development)
  - [Devcontainer](#devcontainer)
  - [Credits](#credits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting started

## Prerequisites

You will need Node v14+ and Yarn v3+ in order to use `moker`.

- Install Node with [nvm](https://github.com/nvm-sh/nvm#install--update-script)
  or using [nodesource](https://github.com/nodesource/distributions#debinstall).
- Install Yarn using these simple steps:
  ```bash
  corepack enable
  corepack prepare yarn@stable --activate
  ```

## Create monorepo

Create a new monorepo:

```bash
yarn dlx moker create my-repo
```

This will initialize a new monorepo in the `my-repo` directory.

> ⚠️ Note that we use `yarn dlx moker` to create a new monorepo. Once we are
> inside our monorepo, we can simply use `yarn moker` to execute commands.

> 🤓 The monorepo is initiated with Yarn without Zero-Installs and in legacy
> `nodeLinker: node-modules` mode because a lot of packages are not yet
> compatible with PnP or require a workaround.

## Use plugins

Of course you want additional tools installed at the monorepo level, add them
with:

```bash
cd my-repo
yarn moker use prettier husky lint-staged
```

Plugins may work together. For example, `lint-staged` will install a pre-commit
hook which formats code if `prettier` and `husky` are installed. The order in
which plugins are added does not matter.

See the section [available plugins](#available-plugins) for a list of options.

> 💡 To quickly get started with the most common plugins, use a monorepo
> template like so:
>
> ```bash
> yarn dlx moker create --template common my-repo
> ```

## Add workspace

To add a new workspace (a.k.a. monorepo package) to your monorepo, use:

```bash
yarn moker add my-workspace
```

Workspaces are added in a customizable subdirectory of the monorepo (the default
is `packages`).

You can also use a workspace template, e.g.:

```bash
yarn moker add --template lib shared
yarn moker add --template express server
yarn moker add --template cra client
yarn moker add --template bandersnatch cli
```

See the section [available templates](#available-templates) for a list of
options.

# Available plugins

## `devcontainer` _monorepo_

**🚧 This plugin is a work in progress**

This plugin sets up [devcontainer](https://containers.dev) configuration at the
monorepo level.

## `github-actions` _monorepo_

**🚧 This plugin is a work in progress**

This plugin sets up [GitHub Actions](https://github.com/features/actions) at the
monorepo level.

## `husky` _monorepo_

This plugin sets up [Husky](https://typicode.github.io/husky/#/) at the monorepo
level.

## `lint-staged` _monorepo_

This plugin sets up [lint-staged](https://github.com/okonet/lint-staged) at the
monorepo level.

If you have the `prettier` plugin installed, this will setup a task to format
staged files using `prettier --write --ignore-unknown`.

If you have the `husky` plugin installed, this will setup a pre-commit hook to
run `yarn lint-staged`.

## `prettier` _monorepo_

This plugin sets up [Prettier](https://prettier.io).

> 🤓 Prettier is installed with this configuration:
>
> ```yaml
> proseWrap: always
> ```
>
> We only set this `proseWrap` override because we think markdown files should
> always be truncated to match whatever the `printWidth` setting is. This makes
> it so much easier to read and write markdown files!

## `jest` _workspace_

This plugin sets up [Jest](https://jestjs.io) and adds a `test` and `watch:test`
script to both the workspace and the monorepo.

## `typescript` _workspace_

This plugin sets up [TypeScript](https://www.typescriptlang.org) and adds a
`build` and `watch:build` script to both the workspace and the monorepo.

# Available templates

## `common` _monorepo_

This is the only monorepo template at this point. It simply installs these
plugins in the monorepo:

- `prettier`
- `husky`
- `lint-staged`
- `github-actions`
- `devcontainer`

## `bandersnatch` _workspace_

Scaffolds a simple [bandersnatch](https://github.com/hongaar/bandersnatch) CLI
app tool with the [typescript](#typescript-workspace) and
[jest](#jest-workspace) plugins.

## `cra` _workspace_

Uses [create-react-app](https://create-react-app.dev/) to scaffold a React.js
app (web client).

## `express` _workspace_

Scaffolds a simple [express](https://expressjs.com) HTTP app with the
[typescript](#typescript-workspace) and [jest](#jest-workspace) plugins.

## `lib` _workspace_

A plain shared library template with the [typescript](#typescript-workspace) and
[jest](#jest-workspace) plugins.

# Contributing

Contributions are very welcome!

## Roadmap

- [ ] github-actions plugin
- [ ] devcontainer plugin
- [ ] Add LICENSE file to monorepo
- [ ] Support for `swc`/`esbuild`
- [ ] A compat lib (which builds cjs and mjs targets)
- [ ] Adapt for non-monorepo use-cases (?)
- [ ] Blog post / tutorial
- [ ] Docs for writing custom plugins / templates
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
