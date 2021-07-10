export const fakerGenFromObjExpectation1 = [
  {
    method: "GET",
    mocks: [
      {
        categories: [
          {
            id: 123,
            name: "fake string",
          },
        ],
        contentType: "fake string",
        id: 123,
        name: "fake string",
        reason: "fake string",
        tag: "fake string",
      },
    ],
    operationId: "findPets",
    path: "/api/v3/pets",
  },
  {
    method: "POST",
    mocks: {
      categories: [
        {
          id: 123,
          name: "fake string",
        },
      ],
      contentType: "fake string",
      id: 123,
      name: "fake string",
      reason: "fake string",
      tag: "fake string",
    },
    operationId: "addPet",
    path: "/api/v3/pets",
  },
  {
    method: "PATCH",
    operationId: "updatePet",
    path: "/api/v3/pets",
  },
  {
    method: "GET",
    mocks: {
      categories: [
        {
          id: 123,
          name: "fake string",
        },
      ],
      contentType: "fake string",
      id: 123,
      name: "fake string",
      reason: "fake string",
      tag: "fake string",
    },
    operationId: "find pet by id",
    path: "/api/v3/pets/{id}",
  },
  {
    method: "DELETE",
    operationId: "deletePet",
    path: "/api/v3/pets/{id}",
  },
  {
    method: "X SWAGGER ROUTER CONTROLLER",
    path: "/api/v3/items",
  },
  {
    method: "GET",
    mocks: [
      {
        color: "fake string",
        id: "fake string",
        name: "fake string",
        price: "fake string",
      },
    ],
    operationId: "getItems",
    path: "/api/v3/items",
    summary: "Returns a list of items",
  },
  {
    method: "POST",
    mocks: null,
    operationId: "createItem",
    path: "/api/v3/items",
    summary: "Creates a new item",
  },
  {
    method: "POST",
    operationId: "postBody",
    path: "/api/v3/body",
  },
  {
    method: "POST",
    operationId: "FormMultipartWithFile",
    path: "/api/v3/demo/forms/multipart",
    summary: "Form Multipart",
  },
  {
    method: "POST",
    operationId: "FormMultipartWithFiles",
    path: "/api/v3/demo/forms/multipart-with-files",
    summary: "Form Multipart With Files",
  },
  {
    method: "POST",
    operationId: "FormURLEncoded",
    path: "/api/v3/demo/forms/url-encoded",
    summary: "Form URL Encoded",
  },
  {
    method: "GET",
    mocks: {
      description: "fake string",
      filename: "fake string",
      open: true,
      readable: true,
    },
    operationId: "generateFeedbackAndLeadReportUsingGET",
    path: "/api/v3/demo/feedback",
    summary: "generateFeedbackAndLeadReport",
  },
];
