# Swagger Faker

![Build Status](https://github.com/reeli/swagger-faker/actions/workflows/deploy.yml/badge.svg)
[![codecov](https://codecov.io/gh/reeli/swagger-faker/branch/master/graph/badge.svg?style=flat-square)](https://codecov.io/gh/reeli/swagger-faker)
[![License](https://img.shields.io/npm/l/swagger-faker.svg?style=flat-square)](https://npmjs.org/package/@ts-tool/swagger-faker)
[![NPM](https://img.shields.io/npm/v/swagger-faker.svg?style=flat-square)](https://npmjs.org/package/@ts-tool/swagger-faker)

Swagger Faker is a tool which can help you generate fake data from your swagger.json file, then it will start a mock server automatically with the generated fake data.

## How to Use

1. Install

```shell
npm i swagger-faker -g
```

2. Init config file by command:

```shell
swagger-faker init
```

Then it will generate a config file `swagger-faker.config.json` in current path, update that config file:

```json
{
  "sourcePaths": ["./source/openapi.json"],
  "outputFolder": "mock-server",
  "timeout": 180000,
  "port": 8081
}
```

- **sourcePaths**: `required`, put your swagger/openapi file path here
- **outputFolder**: `optional`
- **timeout**: `optional`,
- **port**: `optional`

3. Generate fake data

```shell
swagger-faker gen
```

4. Start the mock server

```shell
swagger-faker run
```

## Examples

```shell
git clone https://github.com/reeli/swagger-faker-examples.git
cd  swagger-faker-examples
npm install
npm start
```

Then you'll see:

1. A `mock-server` folder has been generated in your current path, and all mock data is setting in `mock-server/data` folder, you can customize them if needed.
2. A mock server has been started in `http://localhost:8081`, you can open your browser and visit one of the mock API by `http://localhost:8081/api/v2/store/order/1` (The mock data is setting in: `mock-server/data/getOrderById.json`)
