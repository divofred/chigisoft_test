import { AppDataSource } from './data-source';

export const connection = async () => {
  await AppDataSource.initialize()
  .catch(error => console.log(error));
};
