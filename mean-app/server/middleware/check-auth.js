// library imports
const jwt = require('jsonwebtoken');

// code

const SECRET_KEY = "this is a long passphrase that's hard to guess";

module.exports = {
  secret: SECRET_KEY,
  checker: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]; // "Bearer actual-token-here"
      jwt.verify(token, SECRET_KEY);
      next();
    } catch (error) {
      res.status(401).json({ message: 'auth failed', payload: error });
    }
  }
};
