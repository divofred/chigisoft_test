import { MigrationInterface, QueryRunner } from 'typeorm';
import { hashPassword } from '../../utils';
import { UserRole } from '../entities/enums';
import { v4 as uuidv4 } from 'uuid';

export class SeedAdmin1728647527706 implements MigrationInterface {
  name = 'SeedAdmin1728647527706';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminId = uuidv4();
    // Create a hashed password using bcrypt
    const password = await hashPassword('$$Fredrick11$$');

    // SQL query to insert a new user
    await queryRunner.query(`
      INSERT INTO user (id, name, email, password, role, created_at)
      VALUES ('${adminId}','Admin', 'admin@chigisoft.com', '${password}', '${UserRole.ADMIN}', NOW());
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // In case of rollback, remove the seeded user
    await queryRunner.query(`
      DELETE FROM user WHERE email = 'admin@chigisoft.com';
    `);
  }
}
