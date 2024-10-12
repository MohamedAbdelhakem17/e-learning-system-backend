const mongoose = require("mongoose");

const dbConnection = async () => {
  mongoose
    .connect(process.env.DATABASE_CONNECTION_STRING)
    .then((connection) => {
      console.log(`Database Connected : ${connection.connection.host}`);
    });
};

module.exports = dbConnection;
