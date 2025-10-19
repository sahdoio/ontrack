import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSettlementsTable1760885602087 implements MigrationInterface {
    name = 'CreateSettlementsTable1760885602087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "settlements" ("id" uuid NOT NULL, "group_id" uuid NOT NULL, "payer_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, "amount" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5f523ce152b84e818bff9467aab" PRIMARY KEY ("id")); COMMENT ON COLUMN "settlements"."amount" IS 'Amount in cents'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "settlements"`);
    }

}
