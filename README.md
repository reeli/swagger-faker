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

```json5
{
  "sourcePaths": ["./source/openapi.json"], // required, put your swagger/openapi file path here
  "outputFolder": "mock-server", // optional
  "timeout": 180000, // optional
  "port": 8081 // optional
}
```

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

Then you'll see a mock server start in port `8081`, open your browser and visit one of the mock API by this url: `http://localhost:8081/api/v2/store/order/1`.
