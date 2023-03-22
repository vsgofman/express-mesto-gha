const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация 1' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'jwt');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).send({ message: 'Прислан некорректный токен' });
    }
    return res.status(401).send({ message: 'Необходима авторизация 2' });
  }
  req.user = payload;
  return next();
};
