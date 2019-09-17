export const traverseExpectedValue = {
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
      attachment: {
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
                type: "object",
                properties: {
                  price: {
                    type: "string",
                  },
                  address: {
                    type: "string",
                  },
                },
                title: "BookVO",
              },
            },
          },
        },
        title: "ScheduleVO",
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
            type: "object",
            properties: {
              price: {
                type: "string",
              },
              address: {
                type: "string",
              },
            },
            title: "BookVO",
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
        type: "object",
        title: "InputStream",
      },
      open: {
        type: "boolean",
      },
      url: {
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
            type: "object",
            title: "URLStreamHandler",
          },
        },
        title: "URL",
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
        type: "object",
        title: "URLStreamHandler",
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
          attachment: {
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
                    type: "object",
                    properties: {
                      price: {
                        type: "string",
                      },
                      address: {
                        type: "string",
                      },
                    },
                    title: "BookVO",
                  },
                },
              },
            },
            title: "ScheduleVO",
          },
        },
        title: "BookDetailVo",
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
        type: "object",
        properties: {
          attachment: {
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
              attachment: {
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
                        type: "object",
                        properties: {
                          price: {
                            type: "string",
                          },
                          address: {
                            type: "string",
                          },
                        },
                        title: "BookVO",
                      },
                    },
                  },
                },
                title: "ScheduleVO",
              },
            },
            title: "BookDetailVo",
          },
          title: {
            type: "string",
          },
        },
        title: "DocumentVO",
      },
      errors: {
        type: "array",
        items: {
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
    },
  },
};
