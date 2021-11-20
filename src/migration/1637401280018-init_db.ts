import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1637401280018 implements MigrationInterface {
  name = 'initDb1637401280018';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updateAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "name" character varying(300) NOT NULL, "username" character varying(300) NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_1945f9202fcfbce1b439b47b77a" UNIQUE ("username"), CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "member"`);
  }
}
