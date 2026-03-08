const DataUriParser = require("datauri/parser");
const path = require("path");

const getDataUri = (file) => {

  if (!file) return null;

  const parser = new DataUriParser();
  const extName = path.extname(file.originalname);
  return parser.format(extName, file.buffer);
};

module.exports = getDataUri;