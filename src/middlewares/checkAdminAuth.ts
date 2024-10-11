import { Response, NextFunction } from 'express';

import { AuthenticatedRequest } from './index';
import { HttpCodes } from '../utils';
import UserRepo from '../database/repositories/UserRepo';
import { verifyToken } from '../utils';
import { UserRole } from '../database/entities/enums';

const checkAdminAuth = async (
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

    if (user.role !== UserRole.ADMIN) {
      return res
        .status(HttpCodes.FORBIDDEN)
        .json({ message: 'User is not an admin🙄' });
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

export default checkAdminAuth;
