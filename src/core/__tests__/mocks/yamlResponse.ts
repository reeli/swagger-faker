export const yamlResponse = [
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
    method: "POST",
    operationId: "createUser",
    path: "/v2/user",
    summary: "Create user",
  },
];
