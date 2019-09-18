module.exports = () => {
  const book = require("./book.json");
  const a = 1;
  const downloadUsingGET = require("./downloadUsingGET.json");
  return { book, a, downloadUsingGET };
};
