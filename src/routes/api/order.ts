import express from 'express';
import OrderController from '../../controllers/OrderController';
import Validator from '../../middlewares/validator';
import checkAuth from '../../middlewares/checkAuth';
import { CreateOrderValidator } from '../../validation/OrderValidator';

// import {
//   CreateUserValidator
// } from '../../validation/AuthValidator';

const OrderRouter = express.Router();

OrderRouter.post(
  '/',
  checkAuth,
  Validator(CreateOrderValidator),
  OrderController.createOrder
);
OrderRouter.get('/:id', checkAuth, OrderController.getOrderById);
OrderRouter.put('/:id/pay', checkAuth, OrderController.payOrder);

export default OrderRouter;
