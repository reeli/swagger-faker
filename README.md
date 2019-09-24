# Swagger Faker

Generate fake data from swagger.

## Convert Swagger to Fake Data

Example Swagger.json

```json
{
  "swagger": "2.0",
  "info": {},
  "host": "petstore.swagger.io",
  "basePath": "/v2",
  "tags": [],
  "schemes": ["https", "http"],
  "paths": {
    "/pet/findByStatus": {
      "get": {
        "tags": ["pet"],
        "summary": "Finds Pets by status",
        "description": "Multiple status values can be provided with comma separated strings",
        "operationId": "findPetsByStatus",
        "produces": ["application/xml", "application/json"],
        "parameters": [
          {
            "name": "status",
            "in": "query",
            "description": "Status values that need to be considered for filter",
            "required": true,
            "type": "array",
            "items": {
              "type": "string",
              "enum": ["available", "pending", "sold"],
              "default": "available"
            },
            "collectionFormat": "multi"
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/Pet"
              }
            }
          },
          "400": {
            "description": "Invalid status value"
          }
        },
        "security": [
          {
            "petstore_auth": ["write:pets", "read:pets"]
          }
        ]
      }
    }
  },
  "externalDocs": {}
}
```

We can get mock data by passing the swagger and operationId(findPetsByStatus):

```js
const request = getRequestConfigByOperationId(swagger, "findPetsByStatus");
console.log(request);
```

Then we can get the output for the operationId (findPetsByStatus):

```json
{
  "path": "/pet/findByStatus",
  "basePath": "/v2",
  "method": "get",
  "response": [
    {
      "id": 93645,
      "category": {
        "id": 85609,
        "name": "open-source"
      },
      "name": "doggie",
      "photoUrls": ["firewall Berkshire withdrawal"],
      "tags": [
        {
          "id": 13201,
          "name": "Salad synthesize e-business"
        }
      ],
      "status": "pending"
    }
  ],
  "queryParams": ["status"]
}
```
