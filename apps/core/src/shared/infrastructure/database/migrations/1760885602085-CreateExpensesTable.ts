import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExpensesTable1760885602085 implements MigrationInterface {
    name = 'CreateExpensesTable1760885602085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "expenses" ("id" uuid NOT NULL, "group_id" uuid NOT NULL, "payer_id" uuid NOT NULL, "name" character varying(200) NOT NULL, "amount" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id")); COMMENT ON COLUMN "expenses"."amount" IS 'Amount in cents'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "expenses"`);
    }

}
