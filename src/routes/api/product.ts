import express from 'express';
import ProductController from '../../controllers/ProductController';

import Validator from '../../middlewares/validator';
import {
  CreateProductValidator,
  UpdateProductValidator
} from '../../validation/ProductValidator';
import checkAuth from '../../middlewares/checkAuth';
import checkAdminAuth from '../../middlewares/checkAdminAuth';

const ProductRouter = express.Router();

ProductRouter.post(
  '/',
  checkAdminAuth,
  Validator(CreateProductValidator),
  ProductController.createProduct
);

ProductRouter.get('/', checkAuth, ProductController.getProducts);
ProductRouter.get('/:id', checkAuth, ProductController.getProductById);
ProductRouter.put(
  '/:id',
  checkAdminAuth,
  Validator(UpdateProductValidator),
  ProductController.updateProduct
);
ProductRouter.delete('/:id', checkAdminAuth, ProductController.deleteProduct);

export default ProductRouter;
