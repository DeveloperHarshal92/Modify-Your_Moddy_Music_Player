import redis from '../config/cache.js';
import jwt from 'jsonwebtoken';

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: 'Token not provided',
    });
  }

  const isTokenBlackListed = await redis.get(token);

  if (isTokenBlackListed) {
    return res.status(401).json({
      message: 'Invalid token.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid Token',
    });
  }
  next();
}

export { authUser };
