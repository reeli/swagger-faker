export const mockOpenApi = {
  openapi: "3.0.0",
  info: {},
  servers: [],
  paths: {
    "/api/demo": {
      get: {
        description: "some descriptions",
        summary: "some summary",
        operationId: "getDemo",
        parameters: [],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Tree",
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
          },
          "403": {
            description: "Forbidden",
          },
          "404": {
            description: "Not Found",
          },
        },
        deprecated: false,
      },
    },
  },
  components: {
    schemas: {
      Tree: {
        type: "object",
        properties: {
          id: {
            type: "string",
            readOnly: true,
          },
          name: {
            type: "string",
          },
          item: {
            $ref: "#/components/schemas/TreeItem",
          },
        },
      },
      TreeItem: {
        type: "object",
        properties: {
          id: {
            type: "string",
            readOnly: true,
          },
          children: {
            $ref: "#/components/schemas/Tree",
          },
        },
      },
      SuccessData: {
        type: "object",
        properties: {
          status: {
            type: "number",
          },
        },
      },
    },
    responses: {
      SuccessMessage: {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/SuccessData",
            },
          },
        },
      },
    },
  },
} as any;

export const expectedResults = {
  type: "object",
  properties: {
    id: {
      type: "string",
      readOnly: true,
    },
    name: {
      type: "string",
    },
    item: {
      type: "object",
      properties: {
        id: {
          type: "string",
          readOnly: true,
        },
        children: {
          type: "object",
          properties: {
            id: {
              type: "string",
              readOnly: true,
            },
            name: {
              type: "string",
            },
            item: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  readOnly: true,
                },
                children: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      readOnly: true,
                    },
                    name: {
                      type: "string",
                    },
                    item: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          readOnly: true,
                        },
                        children: {
                          type: "object",
                          properties: {
                            id: {
                              type: "string",
                              readOnly: true,
                            },
                            name: {
                              type: "string",
                            },
                            item: null,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
