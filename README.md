# mokr

> 👢 Kick-start TypeScript monorepos (in development)

[![npm (scoped)](https://img.shields.io/npm/v/@mokr/cli?label=%40mokr%2Fcli&logo=npm&style=flat-square)](https://www.npmjs.com/package/@mokr/cli)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/hongaar/mokr?logo=code%20climate&style=flat-square)](https://codeclimate.com/github/hongaar/mokr)

## Features

- Pre-configure common development tools
- Add workspaces on demand
- Workspace templates for a front-end, API or CLI
- Extensible with a plugin system

## Prepare

Our only dependency is Node v16+ and Yarn v3+.

- Install Node with [nvm](https://github.com/nvm-sh/nvm#install--update-script)
  or using [nodesource](https://github.com/nodesource/distributions#debinstall).
- Install Yarn v3 using these simple steps:
  ```bash
  corepack enable
  corepack prepare yarn@stable --activate
  ```

## Getting started

Create a fresh monorepo:

```
yarn dlx mokr create my-repo
cd my-repo
```

All monorepos created with mokr ship with typescript, jest, prettier and
lint-staged.

### Workspaces

Add a new shared library workspace:

```
yarn mokr add my-lib
```

Or use a workspace template (see below):

```
mokr add my-app --template <name>
```

## What's inside

### Prettier

Prettier is installed with this configuration:

```json
proseWrap: "always"
```

We only set this `proseWrap` override because we think markdown files should
always be truncated to match whatever the `printWidth` setting is. Not having to
do this manually makes writing markdown files so much easier!

## Available workspace templates

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

## Development

To make the `mokr` cli available from a local checkout, run:

```
cd packages/cli
yarn global add $PWD
```
