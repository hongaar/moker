# mokr

> 👢 Kick-start monorepos (in development)

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

Add a new create-react-app workspace:

```
mokr add my-app --template cra
```

Add Storybook to an existing workspace:

```
mokr add my-app --template storybook --amend
```

## Available workspace templates

- `lib` Shared library
- `cra` 👷‍♂️ _create-react-app_ React app
- `cli` 👷‍♂️ _bandersnatch_ CLI application
- `storybook` 👷‍♂️ Storybook
