export const mockDefinitions = {
  BookDetailVo: {
    type: "object",
    properties: {
      authorName: {
        type: "string",
        example: "Tony",
      },
      createdDate: {
        type: "integer",
        format: "int64",
        example: 19920010,
      },
      createdTime: {
        type: "string",
        format: "time",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
      },
      attachment: {
        $ref: "#/definitions/ScheduleVO",
      },
    },
    title: "BookDetailVo",
  },
  ScheduleVO: {
    type: "object",
    properties: {
      team: {
        type: "string",
      },
      schedules: {
        type: "array",
        items: {
          type: "array",
          items: {
            $ref: "#/definitions/BookVO",
          },
        },
      },
    },
    title: "ScheduleVO",
  },
  BookVO: {
    type: "object",
    properties: {
      price: {
        type: "string",
      },
      address: {
        type: "string",
      },
      createdAt: {
        type: "string",
        format: "date",
      },
    },
    title: "BookVO",
  },
  InputStream: {
    type: "object",
    title: "InputStream",
  },
  Resource: {
    type: "object",
    properties: {
      description: {
        type: "string",
      },
      file: {
        type: "string",
      },
      filename: {
        type: "string",
      },
      inputStream: {
        $ref: "#/definitions/InputStream",
      },
      open: {
        type: "boolean",
      },
      url: {
        $ref: "#/definitions/URL",
      },
    },
    title: "Resource",
  },
  URI: {
    type: "object",
    properties: {
      absolute: {
        type: "boolean",
      },
      port: {
        type: "integer",
        format: "int32",
      },
      rawSchemeSpecificPart: {
        type: "string",
      },
    },
    title: "URI",
  },
  URL: {
    type: "object",
    properties: {
      content: {
        type: "object",
      },
      defaultPort: {
        type: "integer",
        format: "int32",
      },
      deserializedFields: {
        $ref: "#/definitions/URLStreamHandler",
      },
    },
    title: "URL",
  },
  URLStreamHandler: {
    type: "object",
    title: "URLStreamHandler",
  },
  UpdateBookRequest: {
    type: "object",
    properties: {
      birthCountry: {
        type: "string",
        example: "CN",
      },
      spokenLanguage: {
        type: "array",
        example: ["AH", "AK"],
        items: {
          type: "string",
        },
      },
    },
    title: "UpdateBookRequest",
  },
  DocumentVO: {
    type: "object",
    properties: {
      attachment: {
        $ref: "#/definitions/BookDetailVo",
      },
      title: {
        type: "string",
      },
    },
    title: "DocumentVO",
  },
  AttachmentBO: {
    type: "object",
    properties: {
      authorName: {
        type: "string",
      },
    },
    title: "AttachmentBO",
  },
  File: {
    type: "object",
    properties: {
      absolute: {
        type: "boolean",
      },
      absoluteFile: {
        type: "string",
      },
    },
    title: "File",
  },
  BookingResponse: {
    type: "object",
    required: ["data"],
    properties: {
      data: {
        $ref: "#/definitions/DocumentVO",
      },
      errors: {
        type: "array",
        items: {
          $ref: "#/definitions/ErrorInfo",
        },
      },
    },
    title: "BookingResponse",
  },
  ErrorInfo: {
    type: "object",
    properties: {
      errorMessage: {
        type: "string",
      },
    },
    additionalProperties: {
      test: {
        type: "string",
      },
    },
    title: "ErrorInfo",
  },
  Location: {
    type: "object",
    properties: {
      address: {
        type: "array",
        example: ["test", 123],
        items: [
          {
            type: "string",
          },
          {
            type: "integer",
          },
        ],
      },
      doorNumber: {
        type: "number",
        maximum: 100,
        minimum: 10,
      },
      street: {
        type: "string",
        enum: ["HuaFu Avenue"],
      },
    },
  },
} as any;
