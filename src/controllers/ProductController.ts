import { Response } from 'express';
import ProductRepo from '../database/repositories/ProductRepo';
import { AuthenticatedRequest } from '../middlewares';
import { HttpCodes, PageInfo } from '../utils';

export default class ProductController {
  public static async getProducts(req: AuthenticatedRequest, res: Response) {
    try {
      // Get current page and limit from query params
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const [products, count] = await ProductRepo.getProducts(page, limit);

      const pageInfo = PageInfo(count, limit, page);

      return res.status(HttpCodes.OK).json({
        message: 'Products fetched successfully',
        data: { products, pageInfo }
      });
    } catch (error) {
      console.log('ERROR FETCHING PRODUCTS', error);
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }

  public static async getProductById(req: AuthenticatedRequest, res: Response) {
    try {
      const product = await ProductRepo.getProductById(req.params.id);
      if (!product) {
        return res
          .status(HttpCodes.NOT_FOUND)
          .json({ message: 'Product not found' });
      }
      return res.status(HttpCodes.OK).json({
        message: 'Product fetched successfully',
        data: product
      });
    } catch (error) {
      console.log('ERROR FETCHING PRODUCT', error);
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }

  public static async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const newProduct = await ProductRepo.createProduct(req.body);
      return res.status(HttpCodes.CREATED).json({
        message: 'Product created successfully',
        data: newProduct
      });
    } catch (error) {
      console.log('ERROR CREATING PRODUCT', error);
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }

  public static async deleteProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const deleted = await ProductRepo.deleteProductById(req.params.id);
      if (!deleted) {
        return res
          .status(HttpCodes.NOT_FOUND)
          .json({ message: 'Product not found' });
      }
      return res.status(HttpCodes.OK).json({
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.log('ERROR DELETING PRODUCT', error);
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }

  public static async updateProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const updatedProduct = await ProductRepo.updateProduct(
        req.params.id,
        req.body
      );
      if (!updatedProduct) {
        return res
          .status(HttpCodes.NOT_FOUND)
          .json({ message: 'Product not found' });
      }
      return res.status(HttpCodes.OK).json({
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } catch (error) {
      console.log('ERROR UPDATING PRODUCT', error);
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }
}
