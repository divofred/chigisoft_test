import express from 'express';

import AuthRouter from './auth';
import ProductRouter from './product';
import OrderRouter from './order';

const ApiRouter = express.Router();

ApiRouter.use('/users', AuthRouter);
ApiRouter.use('/products', ProductRouter);
ApiRouter.use('/orders', OrderRouter);

export default ApiRouter;
