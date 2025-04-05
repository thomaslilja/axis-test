# axis-test

GraphQL API proxy.

## :rocket: Deployment status

[![Deploy](https://github.com/thomaslilja/axis-test/actions/workflows/deploy.yml/badge.svg)](https://github.com/thomaslilja/axis-test/actions/workflows/deploy.yml)

## :globe_with_meridians: URL

https://s05dopwpw0.execute-api.eu-north-1.amazonaws.com/graphql

## :construction_worker: Getting started

Clone the repository:

```bash
git clone git@github.com:thomaslilja/axis-test.git
```

Install dependencies:

```bash
npm i
```

Configure AWS:

```bash
aws sso login --profile <your-profile>
```

Run it locally:

```bash
npm run dev
```

## Example query

```bash
curl 'https://s05dopwpw0.execute-api.eu-north-1.amazonaws.com/graphql' \
  -H 'x-api-key: <api-key>' \
  --data-raw '{"query":"query GetItems {\n  getItems {\n    id\n    mandatoryString\n    optionalBoolean\n  }\n}","operationName":"GetItems"}'
```
