import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { User } from '../entities/User';

export default class UserRepo extends Repository<User> {
  static dataRepository = AppDataSource.getRepository(User);

  public static createUser = async (
    data: Omit<User, 'id' | 'created_at' | 'role'>
  ) => {
    return UserRepo.dataRepository.save({
      ...data
    });
  };

  public static getUserByEmail = async (email: string) => {
    return UserRepo.dataRepository.findOneBy({
      email
    });
  };

  public static getUserById = async (id: string) => {
    return UserRepo.dataRepository.findOneBy({
      id
    });
  };
}
