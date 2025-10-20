import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExpenseSplitsTable1760885602086
  implements MigrationInterface
{
  name = 'CreateExpenseSplitsTable1760885602086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "expense_splits" ("id" uuid NOT NULL, "expense_id" uuid NOT NULL, "member_id" uuid NOT NULL, "amount" integer NOT NULL, CONSTRAINT "PK_67774a6f95e6b4acf7a5ce861b0" PRIMARY KEY ("id")); COMMENT ON COLUMN "expense_splits"."amount" IS 'Amount in cents'`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense_splits" ADD CONSTRAINT "FK_a4c2e32db9bc4200aad335b93e5" FOREIGN KEY ("expense_id") REFERENCES "expenses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expense_splits" DROP CONSTRAINT "FK_a4c2e32db9bc4200aad335b93e5"`,
    );
    await queryRunner.query(`DROP TABLE "expense_splits"`);
  }
}
