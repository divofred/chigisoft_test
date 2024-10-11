import express from 'express';
import AuthController from '../../controllers/AuthController';
import Validator from '../../middlewares/validator';
import {
  CreateUserValidator,
  LoginUserValidator
} from '../../validation/AuthValidator';

const UserRouter = express.Router();

UserRouter.post(
  '/register',
  Validator(CreateUserValidator),
  AuthController.createAccount
);

UserRouter.post('/login', Validator(LoginUserValidator), AuthController.login);

export default UserRouter;
