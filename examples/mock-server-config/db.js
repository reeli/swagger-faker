module.exports = () => {
  const book = require("./book.json");
  const a = 1;
  const downloadUsingGET = require("./downloadUsingGET.json");
  const findPetsByStatus = require("./findPetsByStatus.json");
  const findPetsByTags = require("./findPetsByTags.json");
  const getPetById = require("./getPetById.json");
  const getInventory = require("./getInventory.json");
  const getOrderById = require("./getOrderById.json");
  const loginUser = require("./loginUser.json");
  const logoutUser = require("./logoutUser.json");
  const getUserByName = require("./getUserByName.json");
  return {
    book,
    a,
    downloadUsingGET,
    findPetsByStatus,
    findPetsByTags,
    getPetById,
    getInventory,
    getOrderById,
    loginUser,
    logoutUser,
    getUserByName,
  };
};
