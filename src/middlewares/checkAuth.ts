import { Response, NextFunction } from 'express';

import { AuthenticatedRequest } from './index';
import { HttpCodes } from '../utils';
import UserRepo from '../database/repositories/UserRepo';
import { verifyToken } from '../utils';

const checkAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res
      .status(HttpCodes.UNAUTHORIZED)
      .json({ message: 'Authentication failed!' });
  }

  try {
    const decodedToken = await verifyToken(token);
    const user = await UserRepo.getUserById(decodedToken.id);

    if (!user) {
      return res
        .status(HttpCodes.UNAUTHORIZED)
        .json({ message: 'Authentication failed!' });
    }

    req.session = {
      userId: decodedToken.id,
      token
    };
    next();
  } catch (error) {
    console.log('ERROR VERIFYING TOKEN', error);
    return res
      .status(HttpCodes.UNAUTHORIZED)
      .json({ message: 'Authentication failed!' });
  }
};

export default checkAuth;
