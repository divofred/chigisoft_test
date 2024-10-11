import { Response } from 'express';
import OrderRepo from '../database/repositories/OrderRepo';
import { AuthenticatedRequest } from '../middlewares';
import { HttpCodes } from '../utils';
import ProductRepo from '../database/repositories/ProductRepo';
import { OrderStatus } from '../database/entities/enums';

export default class OrderController {
  public static async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId } = req.session;
      const { orderItems } = req.body as {
        orderItems: {
          productId: string;
          quantity: number;
        }[];
      };

      const errors = [] as { message: string; id: string }[];
      const totalPrice = (
        await Promise.all(
          orderItems.map(
            async (item: { productId: string; quantity: number }) => {
              const product = await ProductRepo.getProductById(item.productId);
              if (!product) {
                errors.push({
                  message: `Product with id ${item.productId} not found`,
                  id: item.productId
                });
                return 0;
              }
              console.log(item);
              if (product.quantity < item.quantity) {
                errors.push({
                  message: `Available quantity of product with id ${item.productId} is ${product.quantity}, provided quantity is ${item.quantity}`,
                  id: item.productId
                });
                return 0;
              }
              return product.price * item.quantity;
            }
          )
        )
      ).reduce((acc, price) => acc + price, 0);

      if (errors.length > 0) {
        return res.status(HttpCodes.BAD_REQUEST).json({
          message: 'Order creation failed',
          errors
        });
      }

      const order = await OrderRepo.createOrder({
        total_price: totalPrice,
        userId
      });

      await Promise.all(
        orderItems.map(async item => {
          const product = await ProductRepo.getProductById(item.productId);
          await ProductRepo.updateProduct(item.productId, {
            quantity: product!.quantity - item.quantity
          });
          await OrderRepo.createOrderItem({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product!.price
          });
        })
      );

      const orderWithItems = await OrderRepo.getOrderWithItems(order.id);

      return res.status(HttpCodes.CREATED).json({
        message: 'Order created successfully',
        data: orderWithItems
      });
    } catch (error) {
      console.log('ERROR CREATING ORDER', error);
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }

  public static async getOrderById(req: AuthenticatedRequest, res: Response) {
    try {
      const order = await OrderRepo.getOrderWithItems(req.params.id);
      if (!order) {
        return res
          .status(HttpCodes.NOT_FOUND)
          .json({ message: 'Order not found' });
      }
      if (order.userId !== req.session.userId) {
        return res
          .status(HttpCodes.FORBIDDEN)
          .json({ message: 'Unauthorized' });
      }

      return res.status(HttpCodes.OK).json({
        message: 'Order fetched successfully',
        data: order
      });
    } catch (error) {
      console.log('ERROR FETCHING ORDER', error);
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }

  public static async payOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const order = await OrderRepo.getOrderWithItems(req.params.id);
      if (!order) {
        return res
          .status(HttpCodes.NOT_FOUND)
          .json({ message: 'Order not found' });
      }
      if (order.userId !== req.session.userId) {
        return res
          .status(HttpCodes.FORBIDDEN)
          .json({ message: 'Unauthorized' });
      }
      if (order.status !== OrderStatus.PENDING) {
        return res
          .status(HttpCodes.BAD_REQUEST)
          .json({ message: 'Order payment status has already been updated' });
      }

      const updatedOrder = await OrderRepo.updateOrderStatus(
        OrderStatus.PAID,
        order.id
      );

      await Promise.all(
        order.orderItems.map(async item => {
          const product = await ProductRepo.getProductById(item.productId);
          await ProductRepo.updateProduct(item.productId, {
            quantity: product!.quantity - item.quantity
          });
        })
      );

      return res.status(HttpCodes.OK).json({
        message: 'Order paid for successfully',
        data: updatedOrder
      });
    } catch (error) {
      console.log('ERROR PAYING ORDER', error);
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'An error occurred' });
    }
  }
}
