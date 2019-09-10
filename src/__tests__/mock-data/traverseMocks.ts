export const traverseMocks: any = {
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
        $ref: "#/definitions/File",
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
      absoluteFile: "string",
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
    title: "ErrorInfo",
  },
};
export const expectedValue = {
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
        file: "string",
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
        absoluteFile: "string",
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
      title: "ErrorInfo",
    },
  },
};
