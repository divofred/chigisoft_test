import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedDescriptionToNullable1728644552426
  implements MigrationInterface
{
  name = 'ChangedDescriptionToNullable1728644552426';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product\` CHANGE \`description\` \`description\` varchar(255) NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product\` CHANGE \`description\` \`description\` varchar(255) NOT NULL`
    );
  }
}
