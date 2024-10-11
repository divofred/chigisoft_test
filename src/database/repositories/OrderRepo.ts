import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { OrderStatus } from '../entities/enums';

export default class OrderRepo extends Repository<Order & OrderItem> {
  static orderDataRepository = AppDataSource.getRepository(Order);
  static orderItemDataRepository = AppDataSource.getRepository(OrderItem);

  public static createOrder = async (
    data: Omit<Order, 'id' | 'created_at' | 'status' | 'user' | 'orderItems'>
  ) => {
    return OrderRepo.orderDataRepository.save({
      ...data
    });
  };

  public static createOrderItem = async (
    data: Omit<OrderItem, 'id' | 'created_at' | 'product' | 'order'>
  ) => {
    return OrderRepo.orderItemDataRepository.save({
      ...data
    });
  };

  public static getOrderWithItems = async (orderId: string) => {
    return OrderRepo.orderDataRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product']
    });
  };

  public static updateOrderStatus = async (
    status: OrderStatus,
    orderId: string
  ) => {
    await OrderRepo.orderDataRepository.update(orderId, { status });
    return OrderRepo.orderDataRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product']
    });
  };
}
