# mokr

> 👢 Kick-start TypeScript monorepos (in development)

[![npm (scoped)](https://img.shields.io/npm/v/@mokr/cli?label=%40mokr%2Fcli&logo=npm&style=flat-square)](https://www.npmjs.com/package/@mokr/cli)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/hongaar/mokr?logo=code%20climate&style=flat-square)](https://codeclimate.com/github/hongaar/mokr)

## Features

- Pre-configure common development tools
- Add workspaces on demand
- Workspace templates for a front-end, API or CLI
- Extensible with a plugin system

## Install

```
yarn global add @mokr/cli
```

## Getting started

Create a fresh monorepo:

```
mokr create my-org
cd my-org
```

All monorepo's ship with typescript, lerna, jest, prettier and lint-staged.

### Workspaces

Add a new shared library workspace:

```
mokr add my-lib
```

Or use a workspace template (see below):

```
mokr add my-app --template <name>
```

## Available workspace templates

### `lib`

This is the default template (i.e. used when no template is specified). Your
package will be scaffolded with `typescript`.

### `cra`

Uses [create-react-app](https://create-react-app.dev/) to scaffold a React.js
app (web client)

### `adonis`

Uses [create-adonis-ts-app](https://github.com/AdonisCommunity/create-adonis-ts-app)
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
