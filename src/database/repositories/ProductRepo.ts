import { MoreThan, Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Product } from '../entities/Product';

export default class ProductRepo extends Repository<Product> {
  static dataRepository = AppDataSource.getRepository(Product);

  public static createProduct = async (
    data: Omit<Product, 'id' | 'created_at' | 'description'> & {
      description?: string;
    }
  ) => {
    return ProductRepo.dataRepository.save({
      ...data
    });
  };

  public static getProducts = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return ProductRepo.dataRepository.findAndCount({
      where: {
        quantity: MoreThan(0)
      },
      skip,
      take: limit
    });
  };

  public static getProductById = async (id: string) => {
    return ProductRepo.dataRepository.findOneBy({ id });
  };

  public static updateProduct = async (
    id: string,
    data: Partial<Omit<Product, 'id' | 'created_at'>>
  ) => {
    await ProductRepo.dataRepository.update(id, data);
    return ProductRepo.getProductById(id);
  };

  public static deleteProductById = async (id: string) => {
    return ProductRepo.dataRepository.delete(id);
  };
}
