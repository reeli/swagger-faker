export const fakerGenFromObjExpectationFromOpenApi = [
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
    path: "/api/v3/pets/:id",
  },
  {
    method: "DELETE",
    operationId: "deletePet",
    path: "/api/v3/pets/:id",
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

export const fakerGenFromObjExpectationFromSwagger = [
  {
    method: "POST",
    operationId: "addPet",
    path: "/v2/pet",
    summary: "Add a new pet to the store",
  },
  {
    method: "PUT",
    operationId: "updatePet",
    path: "/v2/pet",
    summary: "Update an existing pet",
  },
  {
    method: "GET",
    mocks: [
      {
        category: {
          id: 123,
          name: "fake string",
        },
        id: 123,
        name: "doggie",
        photoUrls: ["fake string"],
        status: "fake string",
        tags: [
          {
            id: 123,
            name: "fake string",
          },
        ],
      },
    ],
    operationId: "findPetsByStatus",
    path: "/v2/pet/findByStatus",
    summary: "Finds Pets by status",
  },
  {
    method: "GET",
    mocks: [
      {
        category: {
          id: 123,
          name: "fake string",
        },
        id: 123,
        name: "doggie",
        photoUrls: ["fake string"],
        status: "fake string",
        tags: [
          {
            id: 123,
            name: "fake string",
          },
        ],
      },
    ],
    operationId: "findPetsByTags",
    path: "/v2/pet/findByTags",
    summary: "Finds Pets by tags",
  },
  {
    method: "GET",
    mocks: {
      category: {
        id: 123,
        name: "fake string",
      },
      id: 123,
      name: "doggie",
      photoUrls: ["fake string"],
      status: "fake string",
      tags: [
        {
          id: 123,
          name: "fake string",
        },
      ],
    },
    operationId: "getPetById",
    path: "/v2/pet/:petId",
    summary: "Find pet by ID",
  },
  {
    method: "POST",
    operationId: "updatePetWithForm",
    path: "/v2/pet/:petId",
    summary: "Updates a pet in the store with form data",
  },
  {
    method: "DELETE",
    operationId: "deletePet",
    path: "/v2/pet/:petId",
    summary: "Deletes a pet",
  },
  {
    method: "POST",
    mocks: {
      code: 123,
      message: "fake string",
      type: "fake string",
    },
    operationId: "uploadFile",
    path: "/v2/pet/:petId/uploadImage",
    summary: "uploads an image",
  },
  {
    method: "GET",
    mocks: {
      additionalProp: 123,
    },
    operationId: "getInventory",
    path: "/v2/store/inventory",
    summary: "Returns pet inventories by status",
  },
  {
    method: "POST",
    mocks: {
      complete: true,
      id: 123,
      petId: 123,
      quantity: 123,
      shipDate: "2020-10-17T06:27:33.963Z",
      status: "fake string",
    },
    operationId: "placeOrder",
    path: "/v2/store/order",
    summary: "Place an order for a pet",
  },
  {
    method: "GET",
    mocks: {
      complete: true,
      id: 123,
      petId: 123,
      quantity: 123,
      shipDate: "2020-10-17T06:27:33.963Z",
      status: "fake string",
    },
    operationId: "getOrderById",
    path: "/v2/store/order/:orderId",
    summary: "Find purchase order by ID",
  },
  {
    method: "DELETE",
    operationId: "deleteOrder",
    path: "/v2/store/order/:orderId",
    summary: "Delete purchase order by ID",
  },
  {
    method: "POST",
    operationId: "createUser",
    path: "/v2/user",
    summary: "Create user",
  },
  {
    method: "POST",
    operationId: "createUsersWithArrayInput",
    path: "/v2/user/createWithArray",
    summary: "Creates list of users with given input array",
  },
  {
    method: "POST",
    operationId: "createUsersWithListInput",
    path: "/v2/user/createWithList",
    summary: "Creates list of users with given input array",
  },
  {
    method: "GET",
    mocks: "fake string",
    operationId: "loginUser",
    path: "/v2/user/login",
    summary: "Logs user into the system",
  },
  {
    method: "GET",
    operationId: "logoutUser",
    path: "/v2/user/logout",
    summary: "Logs out current logged in user session",
  },
  {
    method: "GET",
    mocks: {
      email: "fake string",
      firstName: "fake string",
      id: 123,
      lastName: "fake string",
      password: "fake string",
      phone: "fake string",
      userStatus: 123,
      username: "fake string",
    },
    operationId: "getUserByName",
    path: "/v2/user/:username",
    summary: "Get user by user name",
  },
  {
    method: "PUT",
    operationId: "updateUser",
    path: "/v2/user/:username",
    summary: "Updated user",
  },
  {
    method: "DELETE",
    operationId: "deleteUser",
    path: "/v2/user/:username",
    summary: "Delete user",
  },
];
