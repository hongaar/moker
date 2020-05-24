# mokr

> 👢 Kick-start TypeScript monorepos (in development)

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

All monorepo's ship with TypeScript.

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
package will be scaffolded with `typescript` and `jest`.

### `cra`

Uses [create-react-app](https://create-react-app.dev/) to scaffold a React.js
app (web client)

### `adonis`

Uses [create-adonis-ts-app](https://github.com/AdonisCommunity/create-adonis-ts-app)
to scaffold an Adonis app (web server)

### `bandersnatch`

Uses [bandersnatch](https://github.com/hongaar/bandersnatch) to scaffold a CLI
tool
