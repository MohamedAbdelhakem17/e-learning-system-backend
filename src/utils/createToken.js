const jsonwebtoken = require("jsonwebtoken");

const generateToken = (paylode, key, expirestionIn) => {
  const token = jsonwebtoken.sign(paylode, key, { expiresIn: expirestionIn });
  return token;
};

module.exports = generateToken;
