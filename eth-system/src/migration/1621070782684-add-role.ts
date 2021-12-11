import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRole1621070782684 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('INSERT INTO role (id, name) VALUES (1, \'使用者\')');
    await queryRunner.query('INSERT INTO role (id, name) VALUES (2, \'管理員\')');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM role WHERE id IN (1,2)');
  }
}
