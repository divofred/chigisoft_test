import { Request, Response } from 'express';

import _ from 'lodash';
import UserRepo from '../database/repositories/UserRepo';
import { AuthenticatedRequest } from '../middlewares';
import {
  hashPassword,
  comparePassword,
  generateToken,
  HttpCodes
} from '../utils';

export default class AuthController {
  public static createAccount = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const user = await UserRepo.getUserByEmail(email);

      if (user) {
        return res.status(HttpCodes.BAD_REQUEST).json({
          message: 'User already exists'
        });
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await UserRepo.createUser({
        name,
        email,
        password: hashedPassword
      });

      return res.status(HttpCodes.CREATED).json({
        message: 'User created',
        data: _.omit(newUser, ['password'])
      });
    } catch (error) {
      console.log('ERROR CREATING ACCOUNT', error);
      return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({
        message: 'An error occurred'
      });
    }
  };

  public static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await UserRepo.getUserByEmail(email);

      if (!user) {
        return res.status(HttpCodes.UNAUTHORIZED).json({
          message: 'Invalid credentials'
        });
      }

      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(HttpCodes.UNAUTHORIZED).json({
          message: 'Invalid credentials'
        });
      }

      const token = generateToken({ id: user.id });

      return res.status(HttpCodes.OK).json({
        message: 'Login successful',
        data: {
          token
        }
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  };
}
