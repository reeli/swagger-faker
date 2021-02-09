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

export const expectedResults1 = {
  properties: {
    message: {
      type: "string",
    },
  },
  type: "object",
};

export const expectedResults2 = {
  items: {
    description: "Without type=object",
    properties: {
      categories: {
        items: {
          properties: {
            id: {
              format: "int64",
              type: "integer",
            },
            name: {
              type: "string",
            },
          },
          type: "object",
          xml: {
            name: "Category",
          },
        },
        type: "array",
        xml: {
          name: "categories",
          wrapped: true,
        },
      },
      contentType: {
        description: "Should generate type instead of enum, when enum value is number like.",
        enum: ["01", "02", "03", "04", "05", "06"],
        type: "string",
      },
      id: {
        format: "int64",
        type: "integer",
      },
      name: {
        type: "string",
      },
      reason: {
        description: "Should generate type instead of enum, when enum value is number like.",
        enum: ["1", "3", "4", "5", "6"],
        type: "string",
      },
      tag: {
        type: "string",
      },
    },
    required: ["name", "id"],
    type: "object",
  },
  type: "array",
};
