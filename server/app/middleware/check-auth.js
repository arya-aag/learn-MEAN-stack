const jwt = require('jsonwebtoken');

module.exports = {
  checker: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1]; // "Bearer actual-token-here"
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);
      req['userData'] = { email: decodedToken.email, userId: decodedToken.userId };
      next();
    } catch (error) {
      res.status(401).json({ message: 'You are not logged in!', payload: error });
    }
  }
};
