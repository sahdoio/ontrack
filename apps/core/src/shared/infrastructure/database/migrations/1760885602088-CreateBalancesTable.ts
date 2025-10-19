import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBalancesTable1760885602088 implements MigrationInterface {
    name = 'CreateBalancesTable1760885602088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "balances" ("id" uuid NOT NULL, "group_id" uuid NOT NULL, "member_id" uuid NOT NULL, "balance" integer NOT NULL, "last_calculated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_600577ab8acb7b36eb008cd04b4" UNIQUE ("group_id", "member_id"), CONSTRAINT "PK_74904758e813e401abc3d4261c2" PRIMARY KEY ("id")); COMMENT ON COLUMN "balances"."balance" IS 'Balance in cents, can be negative'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "balances"`);
    }

}
