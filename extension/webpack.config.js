const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: "inline-source-map",
  bail: true,
  entry: {
    contentScript: path.join(__dirname, "contentScript.js"),
    background: path.join(__dirname, "background.js"),
    inpage: path.join(__dirname, "inpage.js")
  },
  output: {
    path: path.join(__dirname, "..", "build"),
    filename: "[name].js"
  }
};
