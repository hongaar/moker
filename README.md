# mokr

> 👢 Kick-start monorepos (in development)

[![npm (scoped)](https://img.shields.io/npm/v/@mokr/cli?label=%40mokr%2Fcli&logo=npm&style=flat-square)](https://www.npmjs.com/package/@mokr/cli)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/hongaar/mokr?logo=code%20climate&style=flat-square)](https://codeclimate.com/github/hongaar/mokr)

## Features

- ✨ Scaffold a monorepo with ease
- 🧰 Monorepo plugins to use pre-configured common tooling
- ➕ Add workspaces on demand
- 🧬 Workspace templates for a library, React app, API or CLI
- ⚡ Extensible, bring your own plugins! (WIP)

## Why?

When I start a new project it often takes a couple of days before it becomes a
monorepo, at which point I find myself duplicating all sorts of configuration
and build scripts. This project aims to concentrate this struggle in one tool,
which can then be used to scaffold monorepos and workspaces (a.k.a. monorepo
packages).

## Prepare

You will need Node v16+ and Yarn v3+ in order to use `mokr`.

- Install Node with [nvm](https://github.com/nvm-sh/nvm#install--update-script)
  or using [nodesource](https://github.com/nodesource/distributions#debinstall).
- Install Yarn v3 using these simple steps:
  ```bash
  corepack enable
  corepack prepare yarn@stable --activate
  ```

## Getting started

Create a new monorepo:

```bash
yarn dlx mokr create my-repo
```

> ⚠️ Note that we use `yarn dlx mokr` to create a new monorepo. Once we are
> inside our monorepo, we can simply use `yarn mokr` to execute commands.

If you want additional tools installed at the monorepo level, add them with:

```bash
cd my-repo
yarn mokr use <plugins..>
```

For example:

```bash
yarn mokr use prettier devcontainer
```

See the section [plugins](#plugins) for a list of available options.

### Workspaces

Add a new shared library workspace:

```bash
yarn mokr add my-lib
```

Or use a workspace template (see below):

```bash
mokr add my-app --template <name>
```

## Plugins

### Prettier

_WIP_

Prettier is installed with this configuration:

```yaml
proseWrap: always
```

We only set this `proseWrap` override because we think markdown files should
always be truncated to match whatever the `printWidth` setting is. Not having to
do this manually makes writing markdown files so much easier!

### Jest

_WIP_

### GitHub Actions

_WIP_

### Devcontainer

_WIP_

### Husky

_WIP_

## Out-of-the-box workspace templates

### `lib`

This is the default template (i.e. used when no template is specified). Your
package will be scaffolded with `typescript`.

### `cra`

Uses [create-react-app](https://create-react-app.dev/) to scaffold a React.js
app (web client)

### `adonis`

Uses
[create-adonis-ts-app](https://github.com/AdonisCommunity/create-adonis-ts-app)
to scaffold an Adonis app (API server)

### `bandersnatch`

Uses [bandersnatch](https://github.com/hongaar/bandersnatch) to scaffold a CLI
tool

## Roadmap

- Support for `swc`/`esbuild`
- A compat lib (which builds cjs and mjs targets)
- Support for BYO plugins/templates

## Contributing

Contributions are very welcome!

## Development

To run the `mokr` CLI from source, run:

```bash
yarn start
```

Note that you can create a new monorepo for testing purposes outside the current
working directory with:

```bash
yarn start create /path/to/my-repo
```

## What's with the name?

MonorepO KickstarteR
